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
exports.CVAnalysisRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./../../prisma/prisma.service");
let CVAnalysisRepository = class CVAnalysisRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByFileHash(fileHash) {
        return this.prisma.cVAnalysis.findUnique({ where: { fileHash } });
    }
    async findById(id) {
        return this.prisma.cVAnalysis.findUnique({ where: { id } });
    }
    async findByUser(userID) {
        return this.prisma.cVAnalysis.findMany({
            where: { userID },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(userID, fileHash, filename, result) {
        return this.prisma.cVAnalysis.create({
            data: {
                userID,
                fileHash,
                filename,
                result: result,
            },
        });
    }
    async mapToUserProfile(cvBuilderId, userId) {
        const cv = await this.prisma.cVBuilder.findUnique({
            where: { id: cvBuilderId }
        });
        if (!cv)
            throw new Error('CV Builder not found');
        const cvData = cv.data || {};
        const result = cvData.cvData || cvData || {};
        const info = result.personalInfo || {};
        const exps = result.experiences || [];
        const jobTitle = exps[0]?.position || null;
        const experienceYear = this.calculateExperienceYears(exps);
        const careerLevel = this.calculateCareerLevel(exps);
        const userUpdate = {};
        if (info.fullName)
            userUpdate.fullName = info.fullName;
        if (info.phone)
            userUpdate.phone = info.phone;
        if (info.address)
            userUpdate.address = info.address;
        if (Object.keys(userUpdate).length > 0) {
            await this.prisma.user.update({
                where: { userID: userId },
                data: userUpdate,
            });
        }
        const profile = await this.prisma.userProfile.upsert({
            where: { userID: userId },
            update: { jobTitle, experienceYear, careerLevel },
            create: { userID: userId, jobTitle, experienceYear, careerLevel },
        });
        if (result.skills?.length) {
            await this.syncUserSkills(userId, result.skills);
        }
        const user = await this.prisma.user.findUnique({ where: { userID: userId } });
        return {
            fullName: user?.fullName ?? null,
            phone: user?.phone ?? null,
            address: user?.address ?? null,
            jobTitle: profile.jobTitle,
            experienceYear: profile.experienceYear,
            careerLevel: profile.careerLevel,
        };
    }
    calculateExperienceYears(experiences) {
        if (!experiences?.length)
            return null;
        let totalMonths = 0;
        for (const exp of experiences) {
            if (!exp.duration)
                continue;
            const duration = exp.duration;
            const yearMatches = duration.match(/\d{4}/g);
            if (yearMatches && yearMatches.length >= 2) {
                const startYear = parseInt(yearMatches[0]);
                const endYear = parseInt(yearMatches[yearMatches.length - 1]);
                if (!isNaN(startYear) && !isNaN(endYear) && endYear >= startYear) {
                    totalMonths += (endYear - startYear) * 12;
                    const monthMatches = duration.match(/(\d{2})\/\d{4}/g);
                    if (monthMatches && monthMatches.length >= 2) {
                        const startMonth = parseInt(monthMatches[0].split('/')[0]);
                        const endMonth = parseInt(monthMatches[monthMatches.length - 1].split('/')[0]);
                        if (!isNaN(startMonth) && !isNaN(endMonth)) {
                            totalMonths += (endMonth - startMonth);
                        }
                    }
                }
            }
        }
        if (totalMonths === 0)
            return null;
        const years = Math.floor(totalMonths / 12);
        if (years === 0)
            return 'Dưới 1 năm';
        if (years < 2)
            return '1-2 năm';
        if (years < 3)
            return '2-3 năm';
        if (years < 5)
            return '3-5 năm';
        return 'Trên 5 năm';
    }
    calculateCareerLevel(experiences) {
        const yearsStr = this.calculateExperienceYears(experiences);
        if (!yearsStr || yearsStr === 'Dưới 1 năm')
            return 'Intern/Fresher';
        if (yearsStr === '1-2 năm')
            return 'Junior';
        if (yearsStr === '2-3 năm')
            return 'Middle';
        if (yearsStr === '3-5 năm')
            return 'Senior';
        return 'Lead';
    }
    async syncUserSkills(userId, skills) {
        await this.prisma.userSkill.deleteMany({ where: { userID: userId } });
        for (const skill of skills) {
            if (skill.items) {
                for (const name of skill.items.split(',').map((s) => s.trim())) {
                    const existing = await this.prisma.skill.findFirst({ where: { name } });
                    const skillId = existing?.skillID || (await this.prisma.skill.create({
                        data: { name, industryID: 1 },
                    })).skillID;
                    await this.prisma.userSkill.create({ data: { userID: userId, skillID: skillId } });
                }
            }
        }
    }
    async mapLocalDataToUserProfile(userId, data) {
        const { fullName, phone, address, jobTitle, experienceYear, careerLevel } = data;
        const userUpdate = {};
        if (fullName)
            userUpdate.fullName = fullName;
        if (phone)
            userUpdate.phone = phone;
        if (address)
            userUpdate.address = address;
        if (Object.keys(userUpdate).length > 0) {
            await this.prisma.user.update({
                where: { userID: userId },
                data: userUpdate,
            });
        }
        const profileUpdate = {};
        if (jobTitle)
            profileUpdate.jobTitle = jobTitle;
        if (experienceYear)
            profileUpdate.experienceYear = experienceYear;
        if (careerLevel)
            profileUpdate.careerLevel = careerLevel;
        const profile = await this.prisma.userProfile.upsert({
            where: { userID: userId },
            create: { userID: userId, ...profileUpdate },
            update: profileUpdate,
        });
        const user = await this.prisma.user.findUnique({ where: { userID: userId } });
        return {
            fullName: user?.fullName ?? null,
            phone: user?.phone ?? null,
            address: user?.address ?? null,
            jobTitle: profile.jobTitle,
            experienceYear: profile.experienceYear,
            careerLevel: profile.careerLevel,
        };
    }
};
exports.CVAnalysisRepository = CVAnalysisRepository;
exports.CVAnalysisRepository = CVAnalysisRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CVAnalysisRepository);
//# sourceMappingURL=cv-analysis.repository.js.map