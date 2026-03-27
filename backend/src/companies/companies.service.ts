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

    const where: Prisma.CompanyWhereInput = {};
    const andConditions: Prisma.CompanyWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        companyName: {
          contains: keyword,
          mode: 'insensitive',
        },
      });
    }

    if (location) {
      andConditions.push({
        address: {
          contains: location,
          mode: 'insensitive',
        },
      });
    }

    if (size) {
      andConditions.push({
        companySize: {
          contains: size,
          mode: 'insensitive',
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const companies = await this.prisma.company.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            jobs: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    let result = companies.map((c) => ({
      companyID: c.companyID,
      name: c.companyName,
      logo: c.companyLogo,
      location: c.address,
      size: c.companySize,
      jobCount: c._count.jobs,
    }));

    if (sort === 'jobs') {
      result = result.sort((a, b) => b.jobCount - a.jobCount);
    }

    const total = await this.prisma.company.count({ where });

    return {
      data: result,
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
