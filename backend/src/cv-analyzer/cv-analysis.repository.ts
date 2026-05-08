import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { CVAnalysisResultDto } from './dto/cv-analysis-result.dto';

@Injectable()
export class CVAnalysisRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByFileHash(fileHash: string) {
        return this.prisma.cVAnalysis.findUnique({ where: { fileHash } });
    }

    async findById(id: number) {
        return this.prisma.cVAnalysis.findUnique({ where: { id } });
    }

    async findByUser(userID: number) {
        return this.prisma.cVAnalysis.findMany({
            where: { userID },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(userID: number, fileHash: string, filename: string, result: CVAnalysisResultDto) {
        return this.prisma.cVAnalysis.create({
            data: {
                userID,
                fileHash,
                filename,
                result: result as any,
            },
        });
    }

    // cv-analysis.repository.ts
    async mapToUserProfile(cvBuilderId: number, userId: number) {
        // Query đúng bảng CVBuilder thay vì CVAnalysis
        const cv = await this.prisma.cVBuilder.findUnique({
            where: { id: cvBuilderId }
        });

        if (!cv) throw new Error('CV Builder not found');

        // Parse data từ trường Json
        const cvData = cv.data as any || {};
        const result = cvData.cvData || cvData || {};

        const info = result.personalInfo || {};
        const exps = result.experiences || [];

        // ── Career fields ──
        const jobTitle = exps[0]?.position || null;
        const experienceYear = this.calculateExperienceYears(exps);
        const careerLevel = this.calculateCareerLevel(exps);

        // ── Personal fields: chỉ ghi đè nếu có data ──
        const userUpdate: Record<string, any> = {};
        if (info.fullName) userUpdate.fullName = info.fullName;
        if (info.phone) userUpdate.phone = info.phone;
        if (info.address) userUpdate.address = info.address;

        if (Object.keys(userUpdate).length > 0) {
            await this.prisma.user.update({
                where: { userID: userId },
                data: userUpdate,
            });
        }

        // ── Upsert UserProfile ──
        const profile = await this.prisma.userProfile.upsert({
            where: { userID: userId },
            update: { jobTitle, experienceYear, careerLevel },
            create: { userID: userId, jobTitle, experienceYear, careerLevel },
        });

        // ── Sync skills ──
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

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private calculateExperienceYears(experiences: any[]): string | null {
        if (!experiences?.length) return null;

        let totalMonths = 0;
        for (const exp of experiences) {
            if (!exp.duration) continue;
            const duration = exp.duration as string;
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

        if (totalMonths === 0) return null;

        const years = Math.floor(totalMonths / 12);

        // Khớp đúng với các <option> trong ProfileScreen select
        if (years === 0) return 'Dưới 1 năm';
        if (years < 2) return '1-2 năm';
        if (years < 3) return '2-3 năm';
        if (years < 5) return '3-5 năm';
        return 'Trên 5 năm';
    }

    private calculateCareerLevel(experiences: any[]): string | null {
        const yearsStr = this.calculateExperienceYears(experiences);
        if (!yearsStr || yearsStr === 'Dưới 1 năm') return 'Intern/Fresher';
        if (yearsStr === '1-2 năm') return 'Junior';
        if (yearsStr === '2-3 năm') return 'Middle';
        if (yearsStr === '3-5 năm') return 'Senior';
        return 'Lead'; // Trên 5 năm
    }

    // private calculateCareerLevel(experiences: any[]): string | null {
    //     const yearsStr = this.calculateExperienceYears(experiences);
    //     if (!yearsStr) return 'Intern/Fresher';

    //     // Parse số năm từ string "X năm Y tháng"
    //     const yearMatch = yearsStr.match(/(\d+)\s*năm/);
    //     const years = yearMatch ? parseInt(yearMatch[1]) : 0;

    //     if (years < 1) return 'Intern/Fresher';
    //     if (years < 3) return 'Junior';
    //     if (years < 5) return 'Mid-level';
    //     if (years < 8) return 'Senior';
    //     return 'Manager/Director';
    // }

    private async syncUserSkills(userId: number, skills: any[]) {
        await this.prisma.userSkill.deleteMany({ where: { userID: userId } });
        for (const skill of skills) {
            if (skill.items) {
                for (const name of skill.items.split(',').map((s: string) => s.trim())) {
                    const existing = await this.prisma.skill.findFirst({ where: { name } });
                    const skillId = existing?.skillID || (await this.prisma.skill.create({
                        data: { name, industryID: 1 },
                    })).skillID;
                    await this.prisma.userSkill.create({ data: { userID: userId, skillID: skillId } });
                }
            }
        }
    }


    // ═══════════════════════════════════════════════════════
    // cv-analysis.repository.ts  –  PHẦN THÊM VÀO
    // Thêm method mapLocalDataToUserProfile
    // ═══════════════════════════════════════════════════════

    /**
     * Cập nhật User + UserProfile từ data CV tự tạo.
     * Chỉ ghi đè các field được truyền vào (undefined = giữ nguyên).
     */
    // ─── Map CV tự tạo (localStorage) → Profile ──────────────────────────────
    async mapLocalDataToUserProfile(
        userId: number,
        data: {
            fullName?: string;
            phone?: string;
            address?: string;
            jobTitle?: string;
            experienceYear?: string;
            careerLevel?: string;
        },
    ) {
        const { fullName, phone, address, jobTitle, experienceYear, careerLevel } = data;

        const userUpdate: Record<string, any> = {};
        if (fullName) userUpdate.fullName = fullName;
        if (phone) userUpdate.phone = phone;
        if (address) userUpdate.address = address;

        if (Object.keys(userUpdate).length > 0) {
            await this.prisma.user.update({
                where: { userID: userId },
                data: userUpdate,
            });
        }

        const profileUpdate: Record<string, any> = {};
        if (jobTitle) profileUpdate.jobTitle = jobTitle;
        if (experienceYear) profileUpdate.experienceYear = experienceYear;
        if (careerLevel) profileUpdate.careerLevel = careerLevel;

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
}