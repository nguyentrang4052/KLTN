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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const node_1 = require("@payos/node");
const notification_service_1 = require("../notification/notification.service");
const PLANS_CONFIG = {
    free: { displayName: 'free', monthlyPrice: 0, yearlyPrice: 0 },
    pro: { displayName: 'pro', monthlyPrice: 10000, yearlyPrice: 96000 },
    elite: { displayName: 'elite', monthlyPrice: 10000, yearlyPrice: 96000 },
};
let SubscriptionService = class SubscriptionService {
    constructor(prisma, config, mailService, notificationService) {
        this.prisma = prisma;
        this.config = config;
        this.mailService = mailService;
        this.notificationService = notificationService;
        this.payos = new node_1.PayOS({
            clientId: this.config.get('PAYOS_CLIENT_ID'),
            apiKey: this.config.get('PAYOS_API_KEY'),
            checksumKey: this.config.get('PAYOS_CHECKSUM_KEY'),
        });
    }
    currentMonth() {
        return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 7);
    }
    async grantQuota(userID, planName, billing, subscriptionID, tx) {
        const db = tx ?? this.prisma;
        const plan = await db.subscriptionPlan.findFirst({
            where: { name: planName },
            include: { limits: true },
        });
        if (!plan?.limits)
            return;
        const UNLIMITED = 999;
        const { jobSuggestPerDay, cvAnalysisPerMonth, cvMatchCheckCount } = plan.limits;
        const multiplier = billing === 'yearly' ? 12 : 1;
        const cvAnalysisGrant = cvAnalysisPerMonth >= UNLIMITED ? UNLIMITED : cvAnalysisPerMonth * multiplier;
        const cvMatchGrant = cvMatchCheckCount >= UNLIMITED ? UNLIMITED : cvMatchCheckCount * multiplier;
        const today = new Date().toISOString().slice(0, 10);
        await db.userQuota.upsert({
            where: { subscriptionID },
            update: {
                jobSuggestPerDay,
                jobSuggestUsedToday: 0,
                jobSuggestResetDate: today,
                cvAnalysisTotal: cvAnalysisGrant,
                cvMatchCheckTotal: cvMatchGrant,
                cvAnalysisUsed: 0,
                cvMatchCheckUsed: 0,
            },
            create: {
                userID,
                subscriptionID,
                jobSuggestPerDay,
                jobSuggestUsedToday: 0,
                jobSuggestResetDate: today,
                cvAnalysisTotal: cvAnalysisGrant,
                cvMatchCheckTotal: cvMatchGrant,
                cvAnalysisUsed: 0,
                cvMatchCheckUsed: 0,
            },
        });
    }
    async revokeQuota(userID, tx) {
        const db = tx ?? this.prisma;
        const subQuota = await db.userQuota.findFirst({
            where: {
                userID,
                subscriptionID: { not: null },
            },
            orderBy: { id: 'desc' },
        });
        if (subQuota) {
            await db.userQuota.delete({ where: { id: subQuota.id } });
        }
        const freeQuota = await this.prisma.userQuota.findFirst({
            where: { userID, subscriptionID: null },
        });
        if (freeQuota) {
            const freePlan = await this.prisma.subscriptionPlan.findFirst({
                where: { name: 'free' },
                include: { limits: true },
            });
            await this.prisma.userQuota.update({
                where: { id: freeQuota.id },
                data: {
                    cvAnalysisTotal: 10,
                    cvMatchCheckTotal: 20,
                    cvAnalysisUsed: 0,
                    cvMatchCheckUsed: 0,
                    jobSuggestPerDay: freePlan?.limits?.jobSuggestPerDay ?? 3,
                    jobSuggestUsedToday: 0,
                },
            });
        }
    }
    async getUserQuota(accountID) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const today = new Date().toISOString().slice(0, 10);
        const UNLIMITED = 999;
        const remaining = (total, used) => total >= UNLIMITED ? UNLIMITED : Math.max(0, total - used);
        const { activeSub, quota } = await this.getActiveQuota(user.userID);
        if (quota && (quota.jobSuggestResetDate == null || quota.jobSuggestResetDate < today)) {
            await this.prisma.userQuota.update({
                where: { id: quota.id },
                data: { jobSuggestUsedToday: 0, jobSuggestResetDate: today },
            });
            quota.jobSuggestUsedToday = 0;
        }
        const subExpired = activeSub && new Date() > new Date(activeSub.expiresAt);
        if (!quota) {
            const limits = activeSub?.plan?.limits ?? await this.getFreePlanLimits();
            return {
                jobSuggestPerDay: limits.jobSuggestPerDay,
                jobSuggestUsedToday: 0,
                cvAnalysisTotal: 0,
                cvAnalysisUsed: 0,
                cvAnalysisRemaining: 0,
                cvMatchCheckTotal: 0,
                cvMatchCheckUsed: 0,
                cvMatchCheckRemaining: 0,
                subExpired: false,
            };
        }
        return {
            jobSuggestPerDay: quota.jobSuggestPerDay,
            jobSuggestUsedToday: quota.jobSuggestUsedToday,
            cvAnalysisTotal: quota.cvAnalysisTotal,
            cvAnalysisUsed: quota.cvAnalysisUsed,
            cvAnalysisRemaining: subExpired ? 0 : remaining(quota.cvAnalysisTotal, quota.cvAnalysisUsed),
            cvMatchCheckTotal: quota.cvMatchCheckTotal,
            cvMatchCheckUsed: quota.cvMatchCheckUsed,
            cvMatchCheckRemaining: subExpired ? 0 : remaining(quota.cvMatchCheckTotal, quota.cvMatchCheckUsed),
            subExpired: !!subExpired,
            expiresAt: activeSub?.expiresAt ?? null,
        };
    }
    async checkAndConsumeQuota(accountID, feature) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const UNLIMITED = 999;
        const FEATURE_LABEL = {
            cvAnalysis: 'Phân tích CV',
            cvMatchCheck: 'Kiểm tra độ phù hợp CV',
        };
        const { activeSub, quota } = await this.getActiveQuota(user.userID);
        if (quota?.subscriptionID && activeSub) {
            if (new Date() > new Date(activeSub.expiresAt)) {
                throw new common_1.BadRequestException('Gói dịch vụ của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng.');
            }
        }
        if (!quota) {
            const freeLimits = await this.getFreePlanLimits();
            const FREE_CV_TRIAL = 10;
            const FREE_MATCH_TRIAL = 20;
            const newQuota = await this.prisma.userQuota.create({
                data: {
                    userID: user.userID,
                    subscriptionID: null,
                    jobSuggestPerDay: freeLimits.jobSuggestPerDay,
                    jobSuggestUsedToday: 0,
                    cvAnalysisTotal: FREE_CV_TRIAL,
                    cvMatchCheckTotal: FREE_MATCH_TRIAL,
                    cvAnalysisUsed: feature === 'cvAnalysis' ? 1 : 0,
                    cvMatchCheckUsed: feature === 'cvMatchCheck' ? 1 : 0,
                },
            });
            return { success: true, feature };
        }
        if (feature === 'cvAnalysis') {
            if (quota.cvAnalysisTotal < UNLIMITED && quota.cvAnalysisUsed >= quota.cvAnalysisTotal) {
                throw new common_1.BadRequestException(`Bạn đã dùng hết ${quota.cvAnalysisTotal} lượt ${FEATURE_LABEL[feature]}.`);
            }
            await this.prisma.userQuota.update({
                where: { id: quota.id },
                data: { cvAnalysisUsed: { increment: 1 } },
            });
        }
        if (feature === 'cvMatchCheck') {
            if (quota.cvMatchCheckTotal < UNLIMITED && quota.cvMatchCheckUsed >= quota.cvMatchCheckTotal) {
                throw new common_1.BadRequestException(`Bạn đã dùng hết ${quota.cvMatchCheckTotal} lượt ${FEATURE_LABEL[feature]}.`);
            }
            await this.prisma.userQuota.update({
                where: { id: quota.id },
                data: { cvMatchCheckUsed: { increment: 1 } },
            });
        }
        return { success: true, feature };
    }
    async subscribe(accountID, dto) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.planName === 'free')
            throw new common_1.BadRequestException('Không thể đăng ký gói Free');
        const plan = await this.prisma.subscriptionPlan.findFirst({
            where: { name: dto.planName },
        });
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        const pendingSubs = await this.prisma.userSubscription.findMany({
            where: { userID: user.userID, status: 'pending' },
            select: { id: true },
        });
        if (pendingSubs.length > 0) {
            const pendingIds = pendingSubs.map((s) => s.id);
            await this.prisma.payment.deleteMany({
                where: { subscriptionID: { in: pendingIds } },
            });
            await this.prisma.userSubscription.deleteMany({
                where: { id: { in: pendingIds } },
            });
        }
        const existing = await this.prisma.userSubscription.findFirst({
            where: {
                userID: user.userID,
                status: 'active',
                expiresAt: { gt: new Date() },
                plan: { name: dto.planName },
                billing: dto.billing,
            },
        });
        if (existing)
            throw new common_1.BadRequestException(`Bạn đang sử dụng gói ${plan.displayName} ${dto.billing === 'yearly' ? 'hàng năm' : 'hàng tháng'} rồi`);
        const amount = dto.billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
        const orderCode = Date.now();
        const frontendUrl = this.config.get('FRONTEND_URL');
        const now = new Date();
        const expiresAt = new Date(now);
        if (dto.billing === 'yearly') {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        else {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        }
        const payosRes = await this.payos.paymentRequests.create({
            orderCode,
            amount,
            description: `${plan.displayName} ${dto.billing === 'yearly' ? 'nam' : 'thang'}`,
            returnUrl: `${frontendUrl}/services/checkout/payment?orderCode=${orderCode}&status=success`,
            cancelUrl: `${frontendUrl}/services?status=cancel`,
            items: [{ name: `Goi ${plan.displayName}`, quantity: 1, price: amount }],
        });
        const { subscription, payment } = await this.prisma.$transaction(async (tx) => {
            const subscription = await tx.userSubscription.create({
                data: {
                    userID: user.userID,
                    planID: plan.id,
                    billing: dto.billing,
                    status: 'pending',
                    startedAt: now,
                    expiresAt,
                    autoRenew: false,
                },
                include: { plan: true },
            });
            const payment = await tx.payment.create({
                data: {
                    userID: user.userID,
                    subscriptionID: subscription.id,
                    amount,
                    status: 'pending',
                    method: 'QR_CODE',
                    transactionRef: `${orderCode}`,
                },
            });
            return { subscription, payment };
        });
        return {
            subscription: {
                id: subscription.id,
                planName: subscription.plan.name,
                displayName: subscription.plan.displayName,
                billing: subscription.billing,
                status: subscription.status,
            },
            payment: {
                id: payment.id,
                amount: payment.amount,
                transactionRef: payment.transactionRef,
                status: payment.status,
                checkoutUrl: payosRes.checkoutUrl,
                qrCode: payosRes.qrCode,
            },
        };
    }
    async confirmPayment(dto) {
        const payment = await this.prisma.payment.findUnique({
            where: { transactionRef: dto.transactionRef },
            include: { subscription: { include: { plan: true } } },
        });
        if (!payment)
            throw new common_1.NotFoundException('Không tìm thấy giao dịch');
        if (payment.status === 'success') {
            return {
                success: true,
                status: 'success',
                message: 'Gói đã được kích hoạt thành công!',
            };
        }
        try {
            const orderCode = Number(dto.transactionRef);
            const payosPayment = await this.payos.paymentRequests.get(orderCode);
            if (payosPayment.status === 'PAID') {
                await this.prisma.$transaction(async (tx) => {
                    await tx.payment.update({
                        where: { id: payment.id },
                        data: { status: 'success', paidAt: new Date() },
                    });
                    await tx.userSubscription.updateMany({
                        where: {
                            userID: payment.userID,
                            status: 'active',
                            id: { not: payment.subscriptionID },
                        },
                        data: { status: 'cancelled', autoRenew: false },
                    });
                    await tx.userSubscription.update({
                        where: { id: payment.subscriptionID },
                        data: { status: 'active' },
                    });
                    await this.grantQuota(payment.userID, payment.subscription.plan.name, payment.subscription.billing, payment.subscriptionID, tx);
                });
                const account = await this.prisma.account.findFirst({
                    where: { user: { userID: payment.userID } },
                    include: { user: true },
                });
                if (account) {
                    this.mailService
                        .sendPaymentInvoice(account.email, {
                        fullName: account.user?.fullName ?? undefined,
                        planDisplayName: payment.subscription.plan.displayName,
                        billing: payment.subscription.billing,
                        amount: payment.amount,
                        transactionRef: payment.transactionRef,
                        paidAt: new Date(),
                        expiresAt: payment.subscription.expiresAt,
                    })
                        .catch((err) => console.error('[Mail] sendPaymentInvoice error:', err));
                }
                this.notificationService
                    .create({
                    userID: payment.userID,
                    type: 'payment_success',
                    title: `Kích hoạt gói ${payment.subscription.plan.displayName} thành công`,
                    body: `Thanh toán ${payment.amount.toLocaleString('vi-VN')}đ thành công. Gói có hiệu lực đến ${payment.subscription.expiresAt.toLocaleDateString('vi-VN')}.`,
                    metadata: {
                        planName: payment.subscription.plan.name,
                        amount: payment.amount,
                        transactionRef: payment.transactionRef,
                        expiresAt: payment.subscription.expiresAt,
                    },
                })
                    .catch((err) => console.error('[Notification] payment_success error:', err));
                return {
                    success: true,
                    status: 'success',
                    message: 'Thanh toán thành công! Gói đã được kích hoạt.',
                };
            }
            return {
                success: false,
                status: payosPayment.status,
                message: 'Giao dịch chưa hoàn tất. Vui lòng thanh toán và thử lại.',
            };
        }
        catch (err) {
            console.error('[PayOS] confirmPayment error:', err);
            return {
                success: false,
                status: 'pending',
                message: 'Không thể kiểm tra trạng thái giao dịch. Vui lòng thử lại.',
            };
        }
    }
    async requestRefund(accountID, dto) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const payment = await this.prisma.payment.findFirst({
            where: { userID: user.userID, status: 'success' },
            include: { subscription: true },
            orderBy: { paidAt: 'desc' },
        });
        if (!payment)
            throw new common_1.NotFoundException('Không có giao dịch hợp lệ để hoàn tiền');
        if (!payment.paidAt)
            throw new common_1.BadRequestException('Thông tin thanh toán không hợp lệ');
        const daysSincePaid = Math.floor((Date.now() - new Date(payment.paidAt).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSincePaid > 7)
            throw new common_1.BadRequestException('Đã quá 7 ngày, không thể hoàn tiền');
        const existingRequest = await this.prisma.refundRequest.findFirst({
            where: {
                paymentID: payment.id,
                status: { in: ['pending', 'approved'] },
            },
        });
        if (existingRequest)
            throw new common_1.BadRequestException('Giao dịch này đã có yêu cầu hoàn tiền đang xử lý');
        await this.prisma.$transaction(async (tx) => {
            await tx.refundRequest.create({
                data: {
                    userID: user.userID,
                    paymentID: payment.id,
                    reason: dto.reason,
                    accountNumber: dto.accountNumber,
                    accountName: dto.accountName,
                    bankName: dto.bankName,
                    status: 'pending',
                },
            });
            await tx.payment.update({
                where: { id: payment.id },
                data: { status: 'refund_pending' },
            });
            await tx.userSubscription.update({
                where: { id: payment.subscriptionID },
                data: { status: 'cancelled', autoRenew: false },
            });
            await this.revokeQuota(user.userID, tx);
        });
        return {
            success: true,
            message: 'Yêu cầu hoàn tiền đã được ghi nhận. Admin sẽ chuyển tiền vào tài khoản của bạn trong 7–14 ngày làm việc.',
            amount: payment.amount,
        };
    }
    async cancelSubscription(accountID) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const sub = await this.prisma.userSubscription.findFirst({
            where: {
                userID: user.userID,
                status: 'active',
                expiresAt: { gt: new Date() },
            },
            orderBy: { startedAt: 'desc' },
        });
        if (!sub)
            throw new common_1.NotFoundException('Không có gói đang active');
        await this.prisma.userSubscription.update({
            where: { id: sub.id },
            data: { autoRenew: false },
        });
        return {
            message: 'Đã hủy gói. Gói sẽ tiếp tục đến hết chu kỳ hiện tại.',
            expiresAt: sub.expiresAt,
        };
    }
    async getCurrentSubscription(accountID) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const sub = await this.prisma.userSubscription.findFirst({
            where: {
                userID: user.userID,
                status: 'active',
                expiresAt: { gt: new Date() },
            },
            include: { plan: true },
            orderBy: { startedAt: 'desc' },
        });
        if (!sub) {
            const freePlan = await this.prisma.subscriptionPlan.findFirst({
                where: { name: 'free' },
                include: { limits: true },
            });
            return {
                planName: 'free',
                displayName: 'free',
                billing: null,
                status: 'active',
                expiresAt: null,
                autoRenew: false,
                plan: freePlan,
            };
        }
        const lastPayment = await this.prisma.payment.findFirst({
            where: { userID: user.userID, status: 'success' },
            orderBy: { paidAt: 'desc' },
            select: { paidAt: true },
        });
        return {
            subscriptionID: sub.id,
            planName: sub.plan.name,
            displayName: sub.plan.displayName,
            billing: sub.billing,
            status: sub.status,
            startedAt: sub.startedAt,
            expiresAt: sub.expiresAt,
            autoRenew: false,
            plan: sub.plan,
            paidAt: lastPayment?.paidAt ?? null,
        };
    }
    async getPaymentHistory(accountID) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const payments = await this.prisma.payment.findMany({
            where: {
                userID: user.userID,
                status: { in: ['success', 'refund_pending', 'refunded'] },
            },
            include: { subscription: { include: { plan: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((p) => ({
            id: p.id,
            planName: p.subscription.plan.displayName,
            billing: p.subscription.billing,
            amount: p.amount,
            method: p.method,
            status: p.status,
            transactionRef: p.transactionRef,
            paidAt: p.paidAt,
            createdAt: p.createdAt,
        }));
    }
    async getAllPlans() {
        return this.prisma.subscriptionPlan.findMany({
            include: { limits: true },
            orderBy: { monthlyPrice: 'asc' },
        });
    }
    async seedPlans() {
        const LIMITS_CONFIG = {
            free: {
                jobSuggestPerDay: 3,
                cvAnalysisPerMonth: 10,
                cvMatchCheckCount: 20,
            },
            pro: {
                jobSuggestPerDay: 10,
                cvAnalysisPerMonth: 40,
                cvMatchCheckCount: 60,
            },
            elite: {
                jobSuggestPerDay: 20,
                cvAnalysisPerMonth: 70,
                cvMatchCheckCount: 100,
            },
        };
        for (const [name, config] of Object.entries(PLANS_CONFIG)) {
            const plan = await this.prisma.subscriptionPlan.upsert({
                where: { name },
                update: config,
                create: { name, ...config },
            });
            const limits = LIMITS_CONFIG[name];
            await this.prisma.planLimit.upsert({
                where: { planID: plan.id },
                update: limits,
                create: { planID: plan.id, ...limits },
            });
        }
    }
    async getActiveQuota(userID) {
        const activeSub = await this.prisma.userSubscription.findFirst({
            where: {
                userID,
                status: 'active',
                expiresAt: { gt: new Date() },
            },
            include: {
                plan: { include: { limits: true } },
                quota: true,
            },
            orderBy: { startedAt: 'desc' },
        });
        if (activeSub?.quota) {
            return { activeSub, quota: activeSub.quota };
        }
        const expiredSub = await this.prisma.userSubscription.findFirst({
            where: {
                userID,
                status: 'active',
                expiresAt: { lte: new Date() },
            },
            orderBy: { expiresAt: 'desc' },
        });
        if (expiredSub) {
            await this.prisma.userSubscription.update({
                where: { id: expiredSub.id },
                data: { status: 'expired' },
            });
            await this.revokeQuota(userID);
        }
        const freeQuota = await this.prisma.userQuota.findFirst({
            where: { userID, subscriptionID: null },
        }) ?? null;
        return { activeSub: null, quota: freeQuota };
    }
    async getFreePlanLimits() {
        const freePlan = await this.prisma.subscriptionPlan.findFirst({
            where: { name: 'free' },
            include: { limits: true },
        });
        return {
            jobSuggestPerDay: freePlan?.limits?.jobSuggestPerDay ?? 3,
            cvAnalysisPerMonth: freePlan?.limits?.cvAnalysisPerMonth ?? 0,
            cvMatchCheckCount: freePlan?.limits?.cvMatchCheckCount ?? 0,
        };
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService,
        notification_service_1.NotificationService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map