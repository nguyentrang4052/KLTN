import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryIndustriesDto } from '../dto/industries.dto';

@Injectable()
export class IndustriesService {
  constructor(private prisma: PrismaService) {}

  async getIndustries(dto: QueryIndustriesDto) {
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

    const thisMonthMap: Record<number, number> = Object.fromEntries(
      thisMonth.map((r) => [r.industryID ?? 0, r._count.jobID]),
    );
    const lastMonthMap: Record<number, number> = Object.fromEntries(
      lastMonth.map((r) => [r.industryID ?? 0, r._count.jobID]),
    );

    return industries.map((ind) => {
      const thisCount = thisMonthMap[ind.id] ?? 0;
      const lastCount = lastMonthMap[ind.id] ?? 0;

      let trend = '';
      if (lastCount === 0 && thisCount > 0) {
        trend = '+100%';
      } else if (lastCount > 0) {
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
}
