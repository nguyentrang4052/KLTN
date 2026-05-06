import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class JobAlertService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private notificationService: NotificationService,
  ) {}

  async createAlert(accountID: number, keyword: string) {
    const existing = await this.prisma.jobAlert.findUnique({
      where: { accountID_keyword: { accountID, keyword } },
    });

    if (existing?.active) {
      return { message: 'Bạn đã đăng ký thông báo cho từ khóa này rồi.' };
    }

    await this.prisma.jobAlert.upsert({
      where: { accountID_keyword: { accountID, keyword } },
      update: { active: true },
      create: { accountID, keyword },
    });

    const account = await this.prisma.account.findUnique({
      where: { accountID },
      include: { user: true },
    });

    if (account?.email) {
      await this.mail.sendAlertConfirmation(account.email, keyword);
    }

    if (account?.user?.userID) {
      await this.notificationService
        .create({
          userID: account.user.userID,
          type: 'job_alert',
          title: `Đăng ký thông báo thành công`,
          body: `Bạn sẽ nhận thông báo khi có việc làm mới phù hợp với từ khóa "${keyword}".`,
          metadata: { keyword },
        })
        .catch((err) =>
          console.error('[Notification] createAlert error:', err),
        );
    }

    return { message: 'Đăng ký thành công!' };
  }

  async unsubscribe(accountID: number, keyword: string) {
    const existing = await this.prisma.jobAlert.findUnique({
      where: { accountID_keyword: { accountID, keyword } },
    });

    if (!existing?.active) {
      return { message: 'Không tìm thấy đăng ký phù hợp.' };
    }

    await this.prisma.jobAlert.update({
      where: { accountID_keyword: { accountID, keyword } },
      data: { active: false },
    });

    return { message: 'Đã huỷ đăng ký thông báo.' };
  }

  async getAlertsByAccount(accountID: number) {
    return this.prisma.jobAlert.findMany({
      where: { accountID, active: true },
      select: { keyword: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Cron('0 8 * * *')
  async sendDailyAlerts() {
    const activeAlerts = await this.prisma.jobAlert.findMany({
      where: { active: true },
      include: {
        account: {
          select: {
            email: true,
            emailNotification: true,
            user: { select: { userID: true } },
          },
        },
      },
    });
    if (activeAlerts.length === 0) return;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const today = new Date().toISOString().slice(0, 10);

    for (const alert of activeAlerts) {
      try {
        const jobs = await this.prisma.job.findMany({
          where: {
            isActive: true,
            postedAt: { gte: since },
            OR: [{ deadline: null }, { deadline: { gt: new Date() } }],
            AND: [
              {
                OR: [
                  { title: { contains: alert.keyword, mode: 'insensitive' } },
                  {
                    description: {
                      contains: alert.keyword,
                      mode: 'insensitive',
                    },
                  },
                  {
                    company: {
                      companyName: {
                        contains: alert.keyword,
                        mode: 'insensitive',
                      },
                    },
                  },
                  {
                    skills: {
                      some: {
                        skill: {
                          name: {
                            contains: alert.keyword,
                            mode: 'insensitive',
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          include: {
            company: { select: { companyName: true } },
            skills: { include: { skill: { select: { name: true } } } },
          },
          take: 5,
          orderBy: { postedAt: 'desc' },
        });

        if (jobs.length === 0) continue;

        const userID = alert.account.user?.userID;

        if (userID) {
          const sent = await this.notificationService
            .createIfNotExists({
              userID,
              type: 'job_alert',
              title: `Việc làm mới cho "${alert.keyword}"`,
              body: `Có ${jobs.length} việc làm mới phù hợp với từ khóa "${alert.keyword}" hôm nay.`,
              metadata: {
                keyword: alert.keyword,
                jobIDs: jobs.map((j) => j.jobID),
              },
              dedupeKey: `job_alert_${userID}_${alert.keyword}_${today}`,
            })
            .catch((err) => {
              console.error('[Notif] createIfNotExists error:', err);
              return null;
            });

          if (sent === null) continue; // đã gửi hôm nay rồi, skip cả email
        }

        if (!alert.account.emailNotification) continue;
        await this.mail.sendJobAlert(alert.account.email, alert.keyword, jobs);
      } catch (err) {
        console.error(`Lỗi gửi alert cho accountID=${alert.accountID}:`, err);
      }
    }
  }
}
