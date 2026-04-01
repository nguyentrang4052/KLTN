import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { CreateAlertDto, RemoveAlertDto } from '../dto/alert-job.dto';
import * as fs from 'fs';
import * as path from 'path';

interface JobAlert {
  email: string;
  keyword: string;
  createdAt: string;
  active: boolean;
}

const ALERT_FILE = path.join(process.cwd(), 'job-alerts.json');

@Injectable()
export class JobAlertService implements OnModuleInit {
  private alerts: JobAlert[] = [];

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  onModuleInit() {
    if (fs.existsSync(ALERT_FILE)) {
      try {
        this.alerts = JSON.parse(fs.readFileSync(ALERT_FILE, 'utf-8'));
      } catch {
        this.alerts = [];
      }
    }
  }

  private save() {
    fs.writeFileSync(ALERT_FILE, JSON.stringify(this.alerts, null, 2), 'utf-8');
  }

  async createAlert(dto: CreateAlertDto) {
    const { email, keyword } = dto;

    const already = this.alerts.find(
      (a) =>
        a.email === email &&
        a.keyword.toLowerCase() === keyword.toLowerCase() &&
        a.active,
    );
    if (already) {
      return { message: 'Bạn đã đăng ký thông báo cho từ khóa này rồi.' };
    }

    this.alerts.push({
      email,
      keyword,
      createdAt: new Date().toISOString(),
      active: true,
    });
    this.save();

    await this.mail.sendAlertConfirmation(email, keyword);
    return {
      message:
        'Đăng ký thành công! Chúng tôi sẽ gửi thông báo khi có việc mới.',
    };
  }

  async unsubscribe(dto: RemoveAlertDto) {
    const { email, keyword } = dto;

    const exists = this.alerts.find(
      (a) =>
        a.email === email &&
        a.keyword.toLowerCase() === keyword.toLowerCase() &&
        a.active,
    );
    if (!exists) {
      return { message: 'Không tìm thấy đăng ký phù hợp.' };
    }

    this.alerts = this.alerts.map((a) =>
      a.email === email && a.keyword.toLowerCase() === keyword.toLowerCase()
        ? { ...a, active: false }
        : a,
    );
    this.save();

    return { message: 'Đã huỷ đăng ký thông báo.' };
  }

  @Cron('0 8 * * *')
  async sendDailyAlerts() {
    const activeAlerts = this.alerts.filter((a) => a.active);
    if (activeAlerts.length === 0) return;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const alert of activeAlerts) {
      try {
        const jobs = await this.prisma.job.findMany({
          where: {
            isActive: true,
            postedAt: { gte: since },
            OR: [
              {
                title: {
                  contains: alert.keyword,
                  mode: 'insensitive',
                },
              },
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
          include: {
            company: { select: { companyName: true } },
            skills: {
              include: {
                skill: { select: { name: true } },
              },
            },
          },
          take: 5,
          orderBy: { postedAt: 'desc' },
        });

        if (jobs.length === 0) continue;

        await this.mail.sendJobAlert(alert.email, alert.keyword, jobs);
      } catch (err) {
        console.error(`Lỗi gửi alert cho ${alert.email}:`, err);
      }
    }
  }

  getAlertsByEmail(email: string) {
    return this.alerts
      .filter((a) => a.email === email && a.active)
      .map((a) => ({ keyword: a.keyword, createdAt: a.createdAt }));
  }
}
