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
var NotificationScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const notification_service_1 = require("./notification.service");
let NotificationScheduler = NotificationScheduler_1 = class NotificationScheduler {
    prisma;
    mailService;
    notificationService;
    logger = new common_1.Logger(NotificationScheduler_1.name);
    constructor(prisma, mailService, notificationService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.notificationService = notificationService;
    }
    async sendSubscriptionExpiryReminders() {
        this.logger.log('Running subscription expiry reminder job...');
        const now = new Date();
        const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const expiring = await this.prisma.userSubscription.findMany({
            where: { status: 'active', expiresAt: { gt: now, lte: in7Days } },
            include: { plan: true, user: { include: { account: true } } },
        });
        for (const sub of expiring) {
            const msLeft = sub.expiresAt.getTime() - now.getTime();
            const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
            if (daysLeft !== 7 && daysLeft !== 1)
                continue;
            const email = sub.user.account.email;
            const alreadySent = await this.notificationService.createIfNotExists({
                userID: sub.userID,
                type: 'subscription_expiry',
                title: `Gói ${sub.plan.displayName} sắp hết hạn`,
                body: `Gói của bạn sẽ hết hạn sau ${daysLeft} ngày (${sub.expiresAt.toLocaleDateString('vi-VN')}). Theo dõi gia hạn để không bị gián đoạn.`,
                metadata: {
                    planName: sub.plan.name,
                    daysLeft,
                    expiresAt: sub.expiresAt,
                },
                dedupeKey: `sub_expiry_${sub.userID}_${sub.id}_${daysLeft}d`,
            });
            if (alreadySent == null)
                continue;
            if (!sub.user.account.emailNotification)
                continue;
            await this.mailService.sendSubscriptionExpiringSoon(email, {
                fullName: sub.user.fullName ?? undefined,
                planDisplayName: sub.plan.displayName,
                billing: sub.billing,
                expiresAt: sub.expiresAt,
                daysLeft,
            });
            this.logger.log(`Processed expiry reminder for ${email} (${daysLeft} days left)`);
        }
    }
    async sendSavedJobDeadlineReminders() {
        this.logger.log('Running saved job deadline reminder job...');
        const now = new Date();
        const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const savedJobs = await this.prisma.savedJob.findMany({
            where: { job: { isActive: true, deadline: { gt: now, lte: in3Days } } },
            include: {
                job: { include: { company: { select: { companyName: true } } } },
                user: { include: { account: true } },
            },
        });
        const byUser = new Map();
        for (const saved of savedJobs) {
            const arr = byUser.get(saved.userID) ?? [];
            arr.push(saved);
            byUser.set(saved.userID, arr);
        }
        for (const [, items] of byUser) {
            const { user } = items[0];
            const email = user.account.email;
            const jobs = items
                .map((item) => {
                const deadline = new Date(item.job.deadline);
                const hoursLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)));
                return {
                    jobID: item.job.jobID,
                    title: item.job.title ?? 'Chưa có tiêu đề',
                    companyName: item.job.company.companyName,
                    deadline,
                    hoursLeft,
                    sourceLink: item.job.sourceLink ?? undefined,
                };
            })
                .sort((a, b) => a.hoursLeft - b.hoursLeft);
            const notifBody = jobs.length === 1
                ? `"${jobs[0].title}" tại ${jobs[0].companyName} còn ${jobs[0].hoursLeft} giờ để ứng tuyển.`
                : `Bạn có ${jobs.length} việc làm đã lưu sắp hết hạn trong 3 ngày tới. Urgent nhất: "${jobs[0].title}" (còn ${jobs[0].hoursLeft} giờ).`;
            const alreadySent = await this.notificationService.createIfNotExists({
                userID: user.userID,
                type: 'job_deadline',
                title: `${jobs.length} việc làm đã lưu sắp hết hạn`,
                body: notifBody,
                metadata: { jobIDs: jobs.map((j) => j.jobID), count: jobs.length },
                dedupeKey: `job_deadline_${user.userID}_${jobs
                    .map((j) => j.jobID)
                    .sort()
                    .join('_')}`,
            });
            if (alreadySent == null)
                continue;
            if (!user.account.emailNotification)
                continue;
            await this.mailService.sendSavedJobDeadlineAlert(email, {
                fullName: user.fullName ?? undefined,
                jobs,
            });
            this.logger.log(`Processed saved job deadline alert for ${email} (${jobs.length} jobs)`);
        }
    }
};
exports.NotificationScheduler = NotificationScheduler;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "sendSubscriptionExpiryReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "sendSavedJobDeadlineReminders", null);
exports.NotificationScheduler = NotificationScheduler = NotificationScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        notification_service_1.NotificationService])
], NotificationScheduler);
//# sourceMappingURL=notification.scheduler.js.map