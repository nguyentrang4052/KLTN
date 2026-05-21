"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobAlertService = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../mail/mail.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
const notification_service_1 = require("../notification/notification.service");
let JobAlertService = class JobAlertService {
    prisma;
    mail;
    notificationService;
    constructor(prisma, mail, notificationService) {
        this.prisma = prisma;
        this.mail = mail;
        this.notificationService = notificationService;
    }
    async createAlert(accountID, keyword) {
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
                .catch((err) => console.error('[Notification] createAlert error:', err));
        }
        return { message: 'Đăng ký thành công!' };
    }
    async unsubscribe(accountID, keyword) {
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
    async getAlertsByAccount(accountID) {
        return this.prisma.jobAlert.findMany({
            where: { accountID, active: true },
            select: { keyword: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
    }
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
        if (activeAlerts.length === 0)
            return;
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
                if (jobs.length === 0)
                    continue;
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
                    if (sent === null)
                        continue;
                }
                if (!alert.account.emailNotification)
                    continue;
                await this.mail.sendJobAlert(alert.account.email, alert.keyword, jobs);
            }
            catch (err) {
                console.error(`Lỗi gửi alert cho accountID=${alert.accountID}:`, err);
            }
        }
    }
};
exports.JobAlertService = JobAlertService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobAlertService.prototype, "sendDailyAlerts", null);
exports.JobAlertService = JobAlertService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        notification_service_1.NotificationService])
], JobAlertService);
//# sourceMappingURL=job-alert.service.js.map