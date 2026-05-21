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
exports.IndustriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let IndustriesService = class IndustriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getIndustries(dto) {
        const { keyword } = dto;
        return this.prisma.industry.findMany({
            where: keyword
                ? {
                    name: {
                        contains: keyword,
                        mode: 'insensitive',
                    },
                }
                : {},
            orderBy: {
                name: 'asc',
            },
        });
    }
    async getIndustriesWithCount() {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const industries = await this.prisma.industry.findMany({
            include: {
                _count: { select: { jobs: true } },
            },
            orderBy: { id: 'asc' },
        });
        const [thisMonth, lastMonth] = await Promise.all([
            this.prisma.job.groupBy({
                by: ['industryID'],
                where: { isActive: true, postedAt: { gte: firstOfMonth } },
                _count: { jobID: true },
            }),
            this.prisma.job.groupBy({
                by: ['industryID'],
                where: {
                    isActive: true,
                    postedAt: { gte: firstOfLastMonth, lt: firstOfMonth },
                },
                _count: { jobID: true },
            }),
        ]);
        const thisMonthMap = Object.fromEntries(thisMonth.map((r) => [r.industryID ?? 0, r._count.jobID]));
        const lastMonthMap = Object.fromEntries(lastMonth.map((r) => [r.industryID ?? 0, r._count.jobID]));
        return industries.map((ind) => {
            const thisCount = thisMonthMap[ind.id] ?? 0;
            const lastCount = lastMonthMap[ind.id] ?? 0;
            let trend = '';
            if (lastCount === 0 && thisCount > 0) {
                trend = '+100%';
            }
            else if (lastCount > 0) {
                const delta = Math.round(((thisCount - lastCount) / lastCount) * 100);
                trend = delta >= 0 ? `+${delta}%` : `${delta}%`;
            }
            return {
                id: ind.id,
                name: ind.name,
                jobCount: ind._count.jobs,
                trend,
            };
        });
    }
};
exports.IndustriesService = IndustriesService;
exports.IndustriesService = IndustriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IndustriesService);
//# sourceMappingURL=industries.service.js.map