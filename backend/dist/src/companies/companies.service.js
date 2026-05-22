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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const SIZE_RANGES = {
    'Dưới 10 người': { max: 9 },
    '10-50 người': { min: 10, max: 50 },
    '50-100 người': { min: 51, max: 100 },
    '100-500 người': { min: 101, max: 500 },
    '500-1000 người': { min: 501, max: 1000 },
    'Trên 1000 người': { min: 1001 },
};
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCompanyIDsBySize(size) {
        const range = SIZE_RANGES[size];
        if (!range)
            return [];
        let rows;
        if (range.min !== undefined && range.max !== undefined) {
            rows = await this.prisma.$queryRaw `
        SELECT "companyID" FROM "Company"
        WHERE "companySize" IS NOT NULL
          AND "companySize" ~ '^[0-9]'
          AND CAST(REGEXP_REPLACE("companySize", '[^0-9].*$', '') AS INTEGER)
            BETWEEN ${range.min} AND ${range.max}
      `;
        }
        else if (range.min !== undefined) {
            rows = await this.prisma.$queryRaw `
        SELECT "companyID" FROM "Company"
        WHERE "companySize" IS NOT NULL
          AND "companySize" ~ '^[0-9]'
          AND CAST(REGEXP_REPLACE("companySize", '[^0-9].*$', '') AS INTEGER)
            >= ${range.min}
      `;
        }
        else {
            rows = await this.prisma.$queryRaw `
        SELECT "companyID" FROM "Company"
        WHERE "companySize" IS NOT NULL
          AND "companySize" ~ '^[0-9]'
          AND CAST(REGEXP_REPLACE("companySize", '[^0-9].*$', '') AS INTEGER)
            <= ${range.max}
      `;
        }
        return rows.map((r) => Number(r.companyID));
    }
    async getCompanies(dto) {
        const { keyword, location, size, sort = 'jobs', page = 1, limit = 9 } = dto;
        const skip = (page - 1) * limit;
        const now = new Date();
        const conditions = [];
        if (keyword?.trim()) {
            conditions.push({
                companyName: { contains: keyword, mode: 'insensitive' },
            });
        }
        if (location?.trim()) {
            conditions.push({
                address: { contains: location, mode: 'insensitive' },
            });
        }
        if (size?.trim()) {
            const ids = await this.getCompanyIDsBySize(size);
            if (ids.length === 0) {
                return {
                    data: [],
                    meta: { total: 0, page, limit, totalPages: 0 },
                };
            }
            conditions.push({ companyID: { in: ids } });
        }
        const where = conditions.length > 0 ? { AND: conditions } : {};
        const companies = await this.prisma.company.findMany({
            where,
            include: {
                _count: {
                    select: {
                        jobs: { where: { isActive: true, deadline: { gt: now } } },
                    },
                },
            },
        });
        const result = companies.map((c) => ({
            companyID: c.companyID,
            name: c.companyName,
            logo: c.companyLogo,
            location: c.address,
            size: c.companySize,
            jobCount: c._count.jobs,
        }));
        if (sort === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }
        else {
            result.sort((a, b) => b.jobCount - a.jobCount);
        }
        const total = result.length;
        const paginated = result.slice(skip, skip + limit);
        return {
            data: paginated,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getTopCompanies(limit = 5) {
        const now = new Date();
        const companies = await this.prisma.company.findMany({
            include: {
                _count: {
                    select: {
                        jobs: { where: { isActive: true, deadline: { gt: now } } },
                    },
                },
            },
            where: {
                jobs: {
                    some: { isActive: true, deadline: { gt: now } },
                },
            },
        });
        return companies
            .map((c) => ({
            companyID: c.companyID,
            name: c.companyName,
            logo: c.companyLogo,
            jobCount: c._count.jobs,
        }))
            .sort((a, b) => b.jobCount - a.jobCount)
            .slice(0, limit);
    }
    async getLocations() {
        const locations = await this.prisma.company.groupBy({
            by: ['address'],
            _count: { companyID: true },
            where: { address: { not: null } },
        });
        return locations.map((l) => ({
            value: l.address,
            count: l._count.companyID,
        }));
    }
    async getSizes() {
        const sizes = await this.prisma.company.groupBy({
            by: ['companySize'],
            _count: { companyID: true },
            where: { companySize: { not: null } },
        });
        return sizes.map((s) => ({
            value: s.companySize,
            count: s._count.companyID,
        }));
    }
    async getCompanyById(companyID) {
        const now = new Date();
        const company = await this.prisma.company.findUnique({
            where: { companyID },
            include: {
                _count: {
                    select: {
                        jobs: { where: { isActive: true, deadline: { gt: now } } },
                    },
                },
                jobs: {
                    where: { isActive: true, deadline: { gt: now } },
                    include: {
                        skills: { include: { skill: { select: { name: true } } }, take: 5 },
                        industry: { select: { name: true } },
                    },
                    orderBy: { postedAt: 'desc' },
                },
            },
        });
        if (!company)
            return null;
        return {
            companyID: company.companyID,
            name: company.companyName,
            logo: company.companyLogo,
            website: company.companyWebsite,
            profile: company.companyProfile,
            location: company.address,
            size: company.companySize,
            jobCount: company._count.jobs,
            jobs: company.jobs.map((j) => ({
                jobID: j.jobID,
                title: j.title,
                jobType: j.jobType,
                salary: j.salary,
                experienceYear: j.experienceYear,
                deadline: j.deadline,
                postedAt: j.postedAt,
                skills: j.skills.map((s) => s.skill.name),
            })),
        };
    }
    async getCompanySuggestions(q) {
        if (!q || q.trim().length < 1)
            return [];
        const companies = await this.prisma.company.findMany({
            where: {
                companyName: { contains: q.trim(), mode: 'insensitive' },
                jobs: { some: { isActive: true, deadline: { gt: new Date() } } },
            },
            select: { companyName: true, companyLogo: true },
            distinct: ['companyName'],
            take: 6,
            orderBy: { jobs: { _count: 'desc' } },
        });
        return companies.map((c) => ({
            name: c.companyName,
            logo: c.companyLogo,
        }));
    }
    async saveCompanySearchHistory(accountID, keyword) {
        await this.prisma.searchHistory.deleteMany({
            where: { accountID, keyword, type: 'company' },
        });
        await this.prisma.searchHistory.create({
            data: { accountID, keyword, type: 'company' },
        });
        const all = await this.prisma.searchHistory.findMany({
            where: { accountID, type: 'company' },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
        });
        if (all.length > 10) {
            const toDelete = all.slice(10).map((r) => r.id);
            await this.prisma.searchHistory.deleteMany({
                where: { id: { in: toDelete } },
            });
        }
    }
    async getCompanySearchHistory(accountID) {
        const rows = await this.prisma.searchHistory.findMany({
            where: { accountID, type: 'company' },
            orderBy: { createdAt: 'desc' },
            take: 6,
            select: { keyword: true },
        });
        return rows.map((r) => r.keyword);
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map