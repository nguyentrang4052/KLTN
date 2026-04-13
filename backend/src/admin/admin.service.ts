import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateIndustryDto,
  UpdateIndustryDto,
  CreateSkillDto,
  UpdateSkillDto,
  CreatePackageDto,
  UpdatePackageDto,
} from '../dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ─── DASHBOARD ───────────────────────────────────────────
  async getStats() {
    const [total, active, locked, pro] = await Promise.all([
      this.prisma.account.count({ where: { role: 'user' } }),
      this.prisma.account.count({ where: { role: 'user', active: true } }),
      this.prisma.account.count({ where: { role: 'user', active: false } }),
      this.prisma.userSubscription.count({
        where: { status: 'active', plan: { name: { not: 'Free' } } },
      }),
    ]);
    return { total, active, locked, pro };
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

  // ─── USERS ───────────────────────────────────────────────
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

  async toggleStatus(accountID: number) {
    const account = await this.prisma.account.findUnique({ where: { accountID } });
    if (!account) throw new NotFoundException('Tài khoản không tồn tại.');

    const updated = await this.prisma.account.update({
      where: { accountID },
      data: { active: !account.active },
    });

    return {
      id: updated.accountID,
      status: updated.active ? 'active' : 'locked',
    };
  }

  // ─── INDUSTRIES ──────────────────────────────────────────
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

  async createIndustry(dto: CreateIndustryDto) {
    const duplicate = await this.prisma.industry.findUnique({
      where: { name: dto.name },
    });
    if (duplicate) throw new ConflictException('Tên lĩnh vực đã tồn tại.');
    return this.prisma.industry.create({
      data: { name: dto.name },
    });
  }

  async updateIndustry(id: number, dto: UpdateIndustryDto) {
    const existing = await this.prisma.industry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lĩnh vực không tồn tại.');

    const duplicate = await this.prisma.industry.findUnique({
      where: { name: dto.name },
    });
    if (duplicate && duplicate.id !== id) {
      throw new ConflictException('Tên lĩnh vực đã tồn tại.');
    }

    return this.prisma.industry.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async deleteIndustry(id: number) {
    const existing = await this.prisma.industry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lĩnh vực không tồn tại.');

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

  // ─── SKILLS ──────────────────────────────────────────────
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

  async createSkill(dto: CreateSkillDto) {
    const industry = await this.prisma.industry.findUnique({
      where: { id: dto.industryId },
    });
    if (!industry) throw new NotFoundException('Lĩnh vực không tồn tại.');

    const duplicate = await this.prisma.skill.findUnique({
      where: {
        name_industryID: { name: dto.name, industryID: dto.industryId },
      },
    });
    if (duplicate)
      throw new ConflictException('Kỹ năng đã tồn tại trong lĩnh vực này.');

    return this.prisma.skill.create({
      data: { name: dto.name, industryID: dto.industryId },
      include: { industry: true },
    });
  }

  async updateSkill(id: number, dto: UpdateSkillDto) {
    const existing = await this.prisma.skill.findUnique({ where: { skillID: id } });
    if (!existing) throw new NotFoundException('Kỹ năng không tồn tại.');

    const industry = await this.prisma.industry.findUnique({ where: { id: dto.industryId } });
    if (!industry) throw new NotFoundException('Lĩnh vực không tồn tại.');

    return this.prisma.skill.update({
      where: { skillID: id },
      data: { name: dto.name, industryID: dto.industryId },
      include: { industry: true },
    });
  }

  async deleteSkill(id: number) {
    const existing = await this.prisma.skill.findUnique({
      where: { skillID: id },
    });
    if (!existing) throw new NotFoundException('Kỹ năng không tồn tại.');

    await this.prisma.jobSkill.deleteMany({ where: { skillID: id } });
    await this.prisma.userSkill.deleteMany({ where: { skillID: id } });

    return this.prisma.skill.delete({ where: { skillID: id } });
  }

  // ─── PACKAGES ────────────────────────────────────────────
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

  async createPackage(dto: CreatePackageDto) {
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

  async updatePackage(id: number, dto: UpdatePackageDto) {
    const existing = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Gói dịch vụ không tồn tại.');

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

  async deletePackage(id: number) {
    const existing = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Gói dịch vụ không tồn tại.');

    await this.prisma.planLimit.deleteMany({ where: { planID: id } });
    return this.prisma.subscriptionPlan.delete({ where: { id } });
  }

  async getIndustriesByPlatform(platform?: string) {
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

  async getRefundRequests(status?: string) {
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

  async resolveRefund(
    id: number,
    action: 'approved' | 'rejected',
    note?: string,
  ) {
    const request = await this.prisma.refundRequest.findUnique({
      where: { id },
      include: { payment: true },
    });
    if (!request) throw new NotFoundException('Yêu cầu không tồn tại.');
    if (request.status !== 'pending')
      throw new BadRequestException('Yêu cầu này đã được xử lý rồi.');

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
      } else {
        await tx.payment.update({
          where: { id: request.paymentID },
          data: { status: 'success' },
        });
      }
    });

    return { success: true, action };
  }
}
