import { Injectable, NotFoundException } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto, UpdateUserProfileDto } from '../dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfileByAccountID(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.getProfile(user.userID);
  }

  async getProfile(userID: number) {
    const user = await this.prisma.user.findUnique({
      where: { userID },
      include: {
        account: { select: { email: true, provider: true, createdAt: true } },
        profiles: {
          orderBy: { updatedAt: 'desc' as const },
          take: 1,
          include: { industry: true },
        },
        skills: { include: { skill: { include: { industry: true } } } },
        cvs: { select: { id: true, title: true } },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const profile = user.profiles[0] ?? null;

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
      cvs: user.cvs,
    };
  }

  async updateProfile(userID: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { userID } });
    if (!user) throw new NotFoundException('User not found');

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

  async updateUserProfile(userID: number, dto: UpdateUserProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { userID } });
    if (!user) throw new NotFoundException('User not found');

    const data: any = {
      jobTitle: dto.jobTitle,
      experienceYear: dto.experienceYear,
      careerLevel: dto.careerLevel,
      expectedSalary: dto.expectedSalary,
      workingType: dto.workingType,
    };

    if (dto.industryId) {
      data.industry = {
        connect: { id: dto.industryId },
      };
    }

    const existing = await this.prisma.userProfile.findFirst({
      where: { userID },
      orderBy: { updatedAt: 'desc' as const },
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
  async getSkills(userID: number) {
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

  async addSkill(userID: number, skillID: number) {
    const user = await this.prisma.user.findUnique({ where: { userID } });
    if (!user) throw new NotFoundException('User not found');

    const skill = await this.prisma.skill.findUnique({ where: { skillID } });
    if (!skill) throw new NotFoundException('Skill not found');

    const existing = await this.prisma.userSkill.findFirst({
      where: { userID, skillID },
    });
    if (existing) return existing;

    return this.prisma.userSkill.create({
      data: { userID, skillID },
      include: { skill: true },
    });
  }

  async removeSkill(userID: number, skillID: number) {
    const existing = await this.prisma.userSkill.findFirst({
      where: { userID, skillID },
    });
    if (!existing) throw new NotFoundException('Skill not found on user');

    return this.prisma.userSkill.delete({ where: { id: existing.id } });
  }

  async getStats(userID: number): Promise<{
    viewCount: number;
    saveCount: number;
    applyCount: number;
    recommendCount: number;
  }> {
    const [viewCount, saveCount, applyCount, recommendCount] =
      await Promise.all([
        this.prisma.userBehavior.count({ where: { userID, action: 'view' } }),
        this.prisma.savedJob.count({ where: { userID } }),
        this.prisma.applyHistory.count({ where: { userID } }),
        this.prisma.jobRecommendation.count({ where: { userID } }),
      ]);

    return { viewCount, saveCount, applyCount, recommendCount };
  }

  async updateAvatar(userID: number, file: Express.Multer.File) {
    if (!file) throw new Error('No file uploaded');

    const uploadDir = join(process.cwd(), 'uploads');

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `avatar_${userID}_${Date.now()}.png`;
    const filePath = join(uploadDir, fileName);

    writeFileSync(filePath, file.buffer);

    const avatarUrl = `/uploads/${fileName}`;

    return this.prisma.user.update({
      where: { userID },
      data: { avatar: avatarUrl },
    });
  }
}
