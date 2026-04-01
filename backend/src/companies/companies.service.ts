import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryCompaniesDto } from '../dto/companies.dto';
import { Prisma } from '@prisma/client';

const SIZE_RANGES: Record<string, { min?: number; max?: number }> = {
  'Dưới 10 người': { max: 9 },
  '10-50 người': { min: 10, max: 50 },
  '50-100 người': { min: 51, max: 100 },
  '100-500 người': { min: 101, max: 500 },
  '500-1000 người': { min: 501, max: 1000 },
  'Trên 1000 người': { min: 1001 },
};

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  private async getCompanyIDsBySize(size: string): Promise<number[]> {
    const range = SIZE_RANGES[size];
    if (!range) return [];

    let rows: { companyID: number }[];

    if (range.min !== undefined && range.max !== undefined) {
      rows = await this.prisma.$queryRaw<{ companyID: number }[]>`
        SELECT "companyID" FROM "Company"
        WHERE "companySize" IS NOT NULL
          AND "companySize" ~ '^[0-9]'
          AND CAST(REGEXP_REPLACE("companySize", '[^0-9].*$', '') AS INTEGER)
            BETWEEN ${range.min} AND ${range.max}
      `;
    } else if (range.min !== undefined) {
      rows = await this.prisma.$queryRaw<{ companyID: number }[]>`
        SELECT "companyID" FROM "Company"
        WHERE "companySize" IS NOT NULL
          AND "companySize" ~ '^[0-9]'
          AND CAST(REGEXP_REPLACE("companySize", '[^0-9].*$', '') AS INTEGER)
            >= ${range.min}
      `;
    } else {
      rows = await this.prisma.$queryRaw<{ companyID: number }[]>`
        SELECT "companyID" FROM "Company"
        WHERE "companySize" IS NOT NULL
          AND "companySize" ~ '^[0-9]'
          AND CAST(REGEXP_REPLACE("companySize", '[^0-9].*$', '') AS INTEGER)
            <= ${range.max!}
      `;
    }

    return rows.map((r) => Number(r.companyID));
  }

  async getCompanies(dto: QueryCompaniesDto) {
    const { keyword, location, size, sort = 'jobs', page = 1, limit = 9 } = dto;

    const skip = (page - 1) * limit;
    const conditions: Prisma.CompanyWhereInput[] = [];

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

    const where: Prisma.CompanyWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const companies = await this.prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { jobs: { where: { isActive: true } } },
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
    } else {
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
    const companies = await this.prisma.company.findMany({
      include: {
        _count: {
          select: { jobs: { where: { isActive: true } } },
        },
      },
      orderBy: { jobs: { _count: 'desc' } },
      take: limit,
    });

    return companies.map((c) => ({
      companyID: c.companyID,
      name: c.companyName,
      logo: c.companyLogo,
      jobCount: c._count.jobs,
    }));
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

  async getCompanyById(companyID: number) {
    const company = await this.prisma.company.findUnique({
      where: { companyID },
      include: {
        _count: { select: { jobs: { where: { isActive: true } } } },
        jobs: {
          where: { isActive: true },
          include: {
            skills: { include: { skill: { select: { name: true } } }, take: 5 },
            industry: { select: { name: true } },
          },
          orderBy: { postedAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!company) return null;

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
}
