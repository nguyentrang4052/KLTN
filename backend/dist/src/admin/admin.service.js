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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [total, active, locked, notFree] = await Promise.all([
            this.prisma.account.count({ where: { role: 'user' } }),
            this.prisma.account.count({ where: { role: 'user', active: true } }),
            this.prisma.account.count({ where: { role: 'user', active: false } }),
            this.prisma.userSubscription.count({
                where: { status: 'active', plan: { name: { not: 'free' } } },
            }),
        ]);
        return { total, active, locked, notFree };
    }
    async getRecentUsers() {
        const accounts = await this.prisma.account.findMany({
            where: { role: 'user' },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                user: {
                    include: {
                        subscriptions: {
                            where: { status: 'active' },
                            include: { plan: true },
                            orderBy: { startedAt: 'desc' },
                            take: 1,
                        },
                    },
                },
            },
        });
        return accounts.map((a) => ({
            id: a.accountID,
            name: a.user?.fullName ?? '—',
            email: a.email,
            plan: a.user?.subscriptions[0]?.plan?.displayName ?? 'Free',
            status: a.active ? 'active' : 'locked',
            provider: a.provider,
            joined: a.createdAt.toLocaleDateString('vi-VN'),
        }));
    }
    async getUsers() {
        const accounts = await this.prisma.account.findMany({
            where: { role: 'user' },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        subscriptions: {
                            where: { status: 'active' },
                            include: { plan: true },
                            orderBy: { startedAt: 'desc' },
                            take: 1,
                        },
                    },
                },
            },
        });
        return accounts.map((a) => ({
            id: a.accountID,
            name: a.user?.fullName ?? '—',
            email: a.email,
            plan: a.user?.subscriptions[0]?.plan?.displayName ?? 'Free',
            status: a.active ? 'active' : 'locked',
            provider: a.provider,
            joined: a.createdAt.toLocaleDateString('vi-VN'),
        }));
    }
    async toggleStatus(accountID) {
        const account = await this.prisma.account.findUnique({ where: { accountID } });
        if (!account)
            throw new common_1.NotFoundException('Tài khoản không tồn tại.');
        const updated = await this.prisma.account.update({
            where: { accountID },
            data: { active: !account.active },
        });
        return {
            id: updated.accountID,
            status: updated.active ? 'active' : 'locked',
        };
    }
    async getIndustries() {
        const industries = await this.prisma.industry.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { skills: true } } },
        });
        return industries.map(i => ({
            id: i.id,
            name: i.name,
            skillCount: i._count.skills,
        }));
    }
    async createIndustry(dto) {
        const duplicate = await this.prisma.industry.findUnique({
            where: { name: dto.name },
        });
        if (duplicate)
            throw new common_1.ConflictException('Tên lĩnh vực đã tồn tại.');
        return this.prisma.industry.create({
            data: { name: dto.name },
        });
    }
    async updateIndustry(id, dto) {
        const existing = await this.prisma.industry.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Lĩnh vực không tồn tại.');
        const duplicate = await this.prisma.industry.findUnique({
            where: { name: dto.name },
        });
        if (duplicate && duplicate.id !== id) {
            throw new common_1.ConflictException('Tên lĩnh vực đã tồn tại.');
        }
        return this.prisma.industry.update({
            where: { id },
            data: { name: dto.name },
        });
    }
    async deleteIndustry(id) {
        const existing = await this.prisma.industry.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Lĩnh vực không tồn tại.');
        const skills = await this.prisma.skill.findMany({
            where: { industryID: id },
            select: { skillID: true },
        });
        const skillIDs = skills.map((s) => s.skillID);
        await this.prisma.jobSkill.deleteMany({
            where: { skillID: { in: skillIDs } },
        });
        await this.prisma.userSkill.deleteMany({
            where: { skillID: { in: skillIDs } },
        });
        await this.prisma.skill.deleteMany({ where: { industryID: id } });
        return this.prisma.industry.delete({ where: { id } });
    }
    async getAllSkills() {
        const skills = await this.prisma.skill.findMany({
            include: { industry: true },
            orderBy: { name: 'asc' },
        });
        return skills.map((s) => ({
            id: s.skillID,
            name: s.name,
            industryId: s.industryID,
            industryName: s.industry.name,
        }));
    }
    async createSkill(dto) {
        const industry = await this.prisma.industry.findUnique({
            where: { id: dto.industryId },
        });
        if (!industry)
            throw new common_1.NotFoundException('Lĩnh vực không tồn tại.');
        const duplicate = await this.prisma.skill.findUnique({
            where: {
                name_industryID: { name: dto.name, industryID: dto.industryId },
            },
        });
        if (duplicate)
            throw new common_1.ConflictException('Kỹ năng đã tồn tại trong lĩnh vực này.');
        return this.prisma.skill.create({
            data: { name: dto.name, industryID: dto.industryId },
            include: { industry: true },
        });
    }
    async updateSkill(id, dto) {
        const existing = await this.prisma.skill.findUnique({ where: { skillID: id } });
        if (!existing)
            throw new common_1.NotFoundException('Kỹ năng không tồn tại.');
        const industry = await this.prisma.industry.findUnique({ where: { id: dto.industryId } });
        if (!industry)
            throw new common_1.NotFoundException('Lĩnh vực không tồn tại.');
        return this.prisma.skill.update({
            where: { skillID: id },
            data: { name: dto.name, industryID: dto.industryId },
            include: { industry: true },
        });
    }
    async deleteSkill(id) {
        const existing = await this.prisma.skill.findUnique({
            where: { skillID: id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Kỹ năng không tồn tại.');
        await this.prisma.jobSkill.deleteMany({ where: { skillID: id } });
        await this.prisma.userSkill.deleteMany({ where: { skillID: id } });
        return this.prisma.skill.delete({ where: { skillID: id } });
    }
    async getPackages() {
        const plans = await this.prisma.subscriptionPlan.findMany({
            include: {
                limits: true,
                _count: { select: { subscriptions: { where: { status: 'active' } } } },
            },
            orderBy: { monthlyPrice: 'asc' },
        });
        return plans.map((p) => ({
            id: p.id,
            name: p.name,
            displayName: p.displayName,
            monthlyPrice: p.monthlyPrice,
            yearlyPrice: p.yearlyPrice,
            users: p._count.subscriptions,
            features: {
                dailyJobSuggestions: p.limits?.jobSuggestPerDay ?? 0,
                cvAnalysis: p.limits?.cvAnalysisPerMonth ?? 0,
                compatibilityCheck: p.limits?.cvMatchCheckCount ?? 0,
            },
        }));
    }
    async createPackage(dto) {
        return this.prisma.subscriptionPlan.create({
            data: {
                name: dto.name,
                displayName: dto.name,
                monthlyPrice: dto.monthlyPrice,
                yearlyPrice: dto.yearlyPrice,
                limits: {
                    create: {
                        jobSuggestPerDay: dto.dailyJobSuggestions,
                        cvAnalysisPerMonth: dto.cvAnalysis,
                        cvMatchCheckCount: dto.compatibilityCheck,
                    },
                },
            },
            include: { limits: true },
        });
    }
    async updatePackage(id, dto) {
        const existing = await this.prisma.subscriptionPlan.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Gói dịch vụ không tồn tại.');
        await this.prisma.subscriptionPlan.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name, displayName: dto.name }),
                ...(dto.monthlyPrice !== undefined && {
                    monthlyPrice: dto.monthlyPrice,
                }),
                ...(dto.yearlyPrice !== undefined && { yearlyPrice: dto.yearlyPrice }),
            },
        });
        return this.prisma.planLimit.update({
            where: { planID: id },
            data: {
                ...(dto.dailyJobSuggestions !== undefined && {
                    jobSuggestPerDay: dto.dailyJobSuggestions,
                }),
                ...(dto.cvAnalysis !== undefined && {
                    cvAnalysisPerMonth: dto.cvAnalysis,
                }),
                ...(dto.compatibilityCheck !== undefined && {
                    cvMatchCheckCount: dto.compatibilityCheck,
                }),
            },
        });
    }
    async deletePackage(id) {
        const existing = await this.prisma.subscriptionPlan.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Gói dịch vụ không tồn tại.');
        await this.prisma.planLimit.deleteMany({ where: { planID: id } });
        return this.prisma.subscriptionPlan.delete({ where: { id } });
    }
    async getIndustriesByPlatform(platform) {
        const industries = await this.prisma.industry.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { skills: true } },
                jobs: {
                    where: {
                        ...(platform ? { sourcePlatform: platform } : {}),
                    },
                    select: { jobID: true },
                },
            },
        });
        return industries.map((i) => ({
            id: i.id,
            name: i.name,
            skillCount: i._count.skills,
            jobCount: i.jobs.length,
        }));
    }
    async getPlatforms() {
        const result = await this.prisma.job.groupBy({
            by: ['sourcePlatform'],
            _count: { jobID: true },
            where: { sourcePlatform: { not: null } },
            orderBy: { _count: { jobID: 'desc' } },
        });
        return result.map((r) => ({
            name: r.sourcePlatform,
            jobCount: r._count.jobID,
        }));
    }
    async getRefundRequests(status) {
        const requests = await this.prisma.refundRequest.findMany({
            where: status && status !== 'all' ? { status } : {},
            include: {
                user: { include: { account: { select: { email: true } } } },
                payment: { include: { subscription: { include: { plan: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return requests.map((r) => ({
            id: r.id,
            userID: r.userID,
            userName: r.user.fullName ?? '—',
            userEmail: r.user.account.email,
            reason: r.reason,
            accountNumber: r.accountNumber,
            accountName: r.accountName,
            bankName: r.bankName,
            amount: r.payment.amount,
            planName: r.payment.subscription.plan.displayName,
            billing: r.payment.subscription.billing,
            status: r.status,
            note: r.note,
            createdAt: r.createdAt.toLocaleDateString('vi-VN'),
            resolvedAt: r.resolvedAt?.toLocaleDateString('vi-VN') ?? null,
        }));
    }
    async resolveRefund(id, action, note) {
        const request = await this.prisma.refundRequest.findUnique({
            where: { id },
            include: { payment: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Yêu cầu không tồn tại.');
        if (request.status !== 'pending')
            throw new common_1.BadRequestException('Yêu cầu này đã được xử lý rồi.');
        await this.prisma.$transaction(async (tx) => {
            await tx.refundRequest.update({
                where: { id },
                data: { status: action, note: note ?? null, resolvedAt: new Date() },
            });
            if (action === 'approved') {
                await tx.payment.update({
                    where: { id: request.paymentID },
                    data: { status: 'refunded' },
                });
            }
            else {
                await tx.payment.update({
                    where: { id: request.paymentID },
                    data: { status: 'success' },
                });
            }
        });
        return { success: true, action };
    }
    async getMonthlyRegistrations() {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
            const count = await this.prisma.account.count({
                where: { role: 'user', createdAt: { gte: start, lte: end } },
            });
            months.push({
                label: `T${d.getMonth() + 1}`,
                count,
            });
        }
        return months;
    }
    async getWeeklyStatus() {
        const weeks = [];
        const now = new Date();
        for (let i = 3; i >= 0; i--) {
            const start = new Date(now);
            start.setDate(now.getDate() - i * 7 - 6);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setDate(now.getDate() - i * 7);
            end.setHours(23, 59, 59, 999);
            const [active, locked] = await Promise.all([
                this.prisma.account.count({
                    where: { role: 'user', active: true, createdAt: { lte: end } },
                }),
                this.prisma.account.count({
                    where: { role: 'user', active: false, createdAt: { lte: end } },
                }),
            ]);
            weeks.push({ label: `Tuần ${4 - i}`, active, locked });
        }
        return weeks;
    }
    async getPlanDistribution() {
        const plans = await this.prisma.subscriptionPlan.findMany({
            include: {
                _count: { select: { subscriptions: { where: { status: 'active' } } } },
            },
            orderBy: { monthlyPrice: 'asc' },
        });
        const totalUsers = await this.prisma.account.count({
            where: { role: 'user' },
        });
        const paidUsers = plans
            .filter((p) => p.name !== 'free')
            .reduce((sum, p) => sum + p._count.subscriptions, 0);
        return plans.map((p) => ({
            label: p.displayName ?? p.name,
            count: p.name === 'free' ? totalUsers - paidUsers : p._count.subscriptions,
        }));
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map