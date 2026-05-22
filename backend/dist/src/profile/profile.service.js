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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProfileService = class ProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfileByAccountID(accountID) {
        const user = await this.prisma.user.findFirst({
            where: { accountID },
            select: { userID: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.getProfile(user.userID);
    }
    async getProfile(userID) {
        const user = await this.prisma.user.findUnique({
            where: { userID },
            include: {
                account: { select: { email: true, provider: true, createdAt: true } },
                profiles: {
                    include: { industry: true },
                },
                skills: { include: { skill: { include: { industry: true } } } },
                subscriptions: {
                    where: { status: 'active' },
                    orderBy: { expiresAt: 'desc' },
                    take: 1,
                    include: { plan: { select: { displayName: true, name: true } } },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const profile = user.profiles ?? null;
        const activeSub = user.subscriptions[0] ?? null;
        return {
            userID: user.userID,
            fullName: user.fullName,
            avatar: user.avatar,
            birthYear: user.birthYear,
            phone: user.phone,
            gender: user.gender,
            address: user.address,
            email: user.account.email,
            provider: user.account.provider,
            memberSince: user.account.createdAt,
            jobTitle: profile?.jobTitle ?? null,
            experienceYear: profile?.experienceYear ?? null,
            careerLevel: profile?.careerLevel ?? null,
            expectedSalary: profile?.expectedSalary ?? null,
            workingType: profile?.workingType ?? null,
            industry: profile?.industry
                ? { id: profile.industry.id, name: profile.industry.name }
                : null,
            skills: user.skills.map((s) => ({
                id: s.skill.skillID,
                name: s.skill.name,
                industry: s.skill.industry.name,
            })),
            plan: activeSub
                ? {
                    name: activeSub.plan.name,
                    displayName: activeSub.plan.displayName,
                    expiresAt: activeSub.expiresAt,
                }
                : { name: 'free', displayName: 'Free', expiresAt: null },
        };
    }
    async updateProfile(userID, dto) {
        const user = await this.prisma.user.findUnique({ where: { userID } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { userID },
            data: {
                fullName: dto.fullName,
                birthYear: dto.birthYear,
                phone: dto.phone,
                gender: dto.gender,
                address: dto.address,
            },
        });
    }
    async updateUserProfile(userID, dto) {
        const user = await this.prisma.user.findUnique({ where: { userID } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const data = {
            jobTitle: dto.jobTitle,
            experienceYear: dto.experienceYear,
            careerLevel: dto.careerLevel,
            expectedSalary: dto.expectedSalary,
            workingType: dto.workingType,
            industryID: dto.industryId ?? null,
        };
        const existing = await this.prisma.userProfile.findUnique({
            where: { userID },
        });
        if (existing) {
            return this.prisma.userProfile.update({
                where: { id: existing.id },
                data,
                include: { industry: true },
            });
        }
        return this.prisma.userProfile.create({
            data: { userID, ...data },
            include: { industry: true },
        });
    }
    async getSkills(userID) {
        const userSkills = await this.prisma.userSkill.findMany({
            where: { userID },
            include: { skill: { include: { industry: true } } },
        });
        return userSkills.map((us) => ({
            id: us.skill.skillID,
            name: us.skill.name,
            industry: us.skill.industry.name,
        }));
    }
    async getAllSkills() {
        const skills = await this.prisma.skill.findMany({
            include: { industry: { select: { name: true } } },
            orderBy: { name: 'asc' },
        });
        return skills.map((s) => ({
            skillID: s.skillID,
            name: s.name,
            industry: s.industry.name,
        }));
    }
    async addSkill(userID, skillID) {
        const user = await this.prisma.user.findUnique({ where: { userID } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const skill = await this.prisma.skill.findUnique({ where: { skillID } });
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
        const existing = await this.prisma.userSkill.findFirst({
            where: { userID, skillID },
        });
        if (existing)
            return existing;
        return this.prisma.userSkill.create({
            data: { userID, skillID },
            include: { skill: true },
        });
    }
    async removeSkill(userID, skillID) {
        const existing = await this.prisma.userSkill.findFirst({
            where: { userID, skillID },
        });
        if (!existing)
            throw new common_1.NotFoundException('Skill not found on user');
        return this.prisma.userSkill.delete({ where: { id: existing.id } });
    }
    async getStats(userID) {
        const [viewCount, saveCount, applyCount] = await Promise.all([
            this.prisma.userBehavior.count({ where: { userID, action: 'view' } }),
            this.prisma.savedJob.count({ where: { userID } }),
            this.prisma.jobRecommendation.count({
                where: { userID, matchPercent: { gt: 49 } },
            }),
        ]);
        return { viewCount, saveCount, applyCount };
    }
    async updateAvatar(userID, file) {
        if (!file)
            throw new Error('No file uploaded');
        const uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
        if (!(0, fs_1.existsSync)(uploadDir)) {
            (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
        }
        const fileName = `avatar_${userID}_${Date.now()}.png`;
        const filePath = (0, path_1.join)(uploadDir, fileName);
        (0, fs_1.writeFileSync)(filePath, file.buffer);
        const avatarUrl = `/uploads/${fileName}`;
        return this.prisma.user.update({
            where: { userID },
            data: { avatar: avatarUrl },
        });
    }
    async removeAvatar(userID) {
        return this.prisma.user.update({
            where: { userID },
            data: { avatar: null },
        });
    }
    async getInsights(userID) {
        const [behaviors, savedJobs, profile] = await Promise.all([
            this.prisma.userBehavior.findMany({
                where: { userID, action: 'view' },
                include: {
                    job: {
                        include: { skills: { include: { skill: true } }, industry: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 100,
            }),
            this.prisma.savedJob.findMany({
                where: { userID },
                include: { job: { select: { jobType: true, title: true } } },
                take: 50,
            }),
            this.prisma.userProfile.findUnique({
                where: { userID },
                include: { industry: true }
            }),
        ]);
        const skillCount = new Map();
        for (const b of behaviors) {
            for (const js of b.job.skills) {
                const name = js.skill.name;
                skillCount.set(name, (skillCount.get(name) ?? 0) + 1);
            }
        }
        const topSkills = [...skillCount.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name]) => name);
        const indCount = new Map();
        for (const b of behaviors) {
            const ind = b.job.industry?.name;
            if (ind)
                indCount.set(ind, (indCount.get(ind) ?? 0) + 1);
        }
        const topIndustries = [...indCount.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([name]) => name);
        const remoteCount = savedJobs.filter((s) => ['remote', 'hybrid'].some((t) => s.job.jobType?.toLowerCase().includes(t))).length;
        const remotePct = savedJobs.length > 0
            ? Math.round((remoteCount / savedJobs.length) * 100)
            : 0;
        const insights = [];
        const preferences = [];
        if (topSkills.length > 0) {
            insights.push({
                icon: '👁',
                text: `Bạn thường xem kỹ JD có "${topSkills.join('", "')}"`,
                source: `Từ ${behaviors.length} lần xem`,
            });
        }
        if (savedJobs.length > 0) {
            insights.push({
                icon: '🔖',
                text: remotePct > 0
                    ? `${remotePct}% tin bạn lưu là Hybrid hoặc Remote`
                    : `Bạn đã lưu ${savedJobs.length} việc làm`,
                source: `Từ ${savedJobs.length} lần lưu`,
            });
        }
        if (topIndustries.length > 0) {
            const total = behaviors.length || 1;
            const topInd = topIndustries[0];
            const pct = Math.round(((indCount.get(topInd) ?? 0) / total) * 100);
            insights.push({
                icon: '🏢',
                text: `Ưu tiên ngành ${topIndustries.join(', ')} chiếm ${pct}% lượt xem`,
                source: 'Phân tích toàn lịch sử',
            });
        }
        if (profile?.industry)
            preferences.push({ key: 'Ngành ưu tiên', value: profile.industry.name });
        if (profile?.workingType)
            preferences.push({
                key: 'Hình thức làm việc',
                value: profile.workingType,
            });
        if (profile?.expectedSalary)
            preferences.push({ key: 'Lương kỳ vọng', value: profile.expectedSalary });
        if (profile?.careerLevel)
            preferences.push({ key: 'Cấp bậc', value: profile.careerLevel });
        return { insights, preferences };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map