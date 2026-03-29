import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryCompaniesDto } from '../dto/companies.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getCompanies(dto: QueryCompaniesDto) {
    const { keyword, location, size, sort = 'jobs', page = 1, limit = 9 } = dto;

    const skip = (page - 1) * limit;

    const conditions: Prisma.CompanyWhereInput[] = [];

    if (keyword && keyword.trim() !== '') {
      conditions.push({
        companyName: {
          contains: keyword,
          mode: 'insensitive',
        },
      });
    }

    if (location && location.trim() !== '') {
      conditions.push({
        address: {
          contains: location,
          mode: 'insensitive',
        },
      });
    }

    if (size && size.trim() !== '') {
      conditions.push({
        companySize: {
          contains: size,
          mode: 'insensitive',
        },
      });
    }

    const where: Prisma.CompanyWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const companies = await this.prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            jobs: { where: { isActive: true } },
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
    } else {
      result.sort((a, b) => b.jobCount - a.jobCount);
    }

    const total = result.length;
    const paginated = result.slice(skip, skip + limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTopCompanies(limit = 5) {
    const companies = await this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            jobs: { where: { isActive: true } },
          },
        },
      },
      orderBy: {
        jobs: { _count: 'desc' },
      },
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
}
