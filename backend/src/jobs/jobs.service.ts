import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryJobsDto } from '../dto/jobs.dto';
import { Prisma } from '@prisma/client';

const JOB_TYPE_REVERSE_MAP: Record<string, string[]> = {
  'Toàn thời gian': ['Toàn thời gian', 'Nhân viên chính thức', 'Full-time'],
  'Bán thời gian': ['Bán thời gian', 'Part-time'],
  'Thực tập': ['Thực tập', 'Intern'],
  'Thời vụ': ['Thời vụ'],
  'Freelance': ['Freelance', 'Nghề tự do'],
  'Remote': ['Remote'],
};

const JOB_TYPE_MAP: Record<string, string> = {
  'Nhân viên chính thức': 'Toàn thời gian',
  'Full-time': 'Toàn thời gian',
  'Bán thời gian': 'Bán thời gian',
  'Part-time': 'Bán thời gian',
  'Thực tập': 'Thực tập',
  'Intern': 'Thực tập',
  'Thời vụ': 'Thời vụ',
  'Nghề tự do': 'Freelance',
  'Freelance': 'Freelance',
  'Remote': 'Remote',
};

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) { }

  async getJobs(dto: QueryJobsDto, accountID?: number) {
    const {
      keyword,
      locations,
      industryId,
      sort = 'newest',
      page = 1,
      limit = 9,
      jobType,
      experience,
      source,
      salaryMin,
      salaryMax,
    } = dto;

    const skip = (page - 1) * limit;
    const where: Prisma.JobWhereInput = { isActive: true };
    const andConditions: Prisma.JobWhereInput[] = [];

    if (keyword) {
      andConditions.push({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          {
            company: {
              companyName: { contains: keyword, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    if (industryId) where.industryID = industryId;
    if (experience)
      where.experienceYear = { contains: experience, mode: 'insensitive' };
    if (source) where.sourcePlatform = source;

    if (jobType) {
      const variants = JOB_TYPE_REVERSE_MAP[jobType] ?? [jobType];
      andConditions.push({
        OR: variants.map((v) => ({
          jobType: { contains: v, mode: 'insensitive' as const },
        })),
      });
    }

    if (locations && locations.length > 0) {
      andConditions.push({
        OR: locations.map((loc) => ({
          shortLocation: { contains: loc, mode: 'insensitive' as const },
        })),
      });
    }

    if (salaryMin != null || salaryMax != null) {
      andConditions.push({ salary: { not: null } });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    let orderBy: Prisma.JobOrderByWithRelationInput = { postedAt: 'desc' };
    if (sort === 'deadline') orderBy = { deadline: 'asc' };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          company: {
            select: { companyID: true, companyName: true, companyLogo: true },
          },
          industry: { select: { name: true } },
          skills: { include: { skill: { select: { name: true } } }, take: 5 },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    let matchMap: Record<number, number> = {};
    if (accountID) {
      const user = await this.prisma.user.findFirst({
        where: { accountID },
        select: { userID: true },
      });
      if (user) {
        const recs = await this.prisma.jobRecommendation.findMany({
          where: {
            userID: user.userID,
            jobID: { in: jobs.map((j) => j.jobID) },
          },
          select: { jobID: true, matchPercent: true },
        });
        matchMap = Object.fromEntries(
          recs.map((r) => [r.jobID, r.matchPercent]),
        );
      }
    }

    let jobList = jobs.map((j) => ({
      jobID: j.jobID,
      title: j.title,
      companyID: j.company.companyID,
      companyName: j.company.companyName,
      companyLogo: j.company.companyLogo,
      location: j.location,
      shortLocation: j.shortLocation,
      experienceYear: j.experienceYear,
      salary: j.salary,
      jobType: j.jobType,
      sourcePlatform: j.sourcePlatform,
      sourceLink: j.sourceLink,
      postedAt: j.postedAt,
      deadline: j.deadline,
      industry: j.industry?.name,
      skills: j.skills.map((s) => s.skill.name),
      matchPercent: matchMap[j.jobID] ?? null,
      _salaryNum: parseInt((j.salary ?? '0').replace(/\D.*/, '')) || 0,
    }));

    if (salaryMin != null) {
      jobList = jobList.filter((j) => j._salaryNum >= salaryMin);
    }
    if (salaryMax != null) {
      jobList = jobList.filter((j) => j._salaryNum <= salaryMax);
    }

    if (sort === 'salary')
      jobList = jobList.sort((a, b) => b._salaryNum - a._salaryNum);
    if (sort === 'match')
      jobList = jobList.sort(
        (a, b) => (b.matchPercent ?? 0) - (a.matchPercent ?? 0),
      );

    return {
      data: jobList.map(({ _salaryNum, ...j }) => j),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getJobById(jobID: number) {
    const job = await this.prisma.job.findUnique({
      where: { jobID },
      include: {
        company: true,
        industry: { select: { name: true } },
        skills: {
          include: { skill: { select: { name: true } } },
        },
      },
    });

    if (!job) return null;

    return {
      ...job,
      industry: job.industry?.name,
      skills: job.skills.map((s) => s.skill.name),
    };
  }

  async computeAndSaveRecommendations(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) return;

    const userSkills = await this.prisma.userSkill.findMany({
      where: { userID: user.userID },
      select: { skillID: true },
    });
    const skillIDs = userSkills.map((s) => s.skillID);

    const applied = await this.prisma.applyHistory.findMany({
      where: { userID: user.userID },
      select: { jobID: true },
    });
    const appliedIDs = applied.map((a) => a.jobID);

    const behaviors = await this.prisma.userBehavior.findMany({
      where: { userID: user.userID },
      include: { job: { select: { industryID: true } } },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    const industryIDs = [
      ...new Set(
        behaviors
          .map((b) => b.job.industryID)
          .filter((id): id is number => id !== null),
      ),
    ];

    const orConditions: Prisma.JobWhereInput[] = [];
    if (skillIDs.length) {
      orConditions.push({ skills: { some: { skillID: { in: skillIDs } } } });
    }
    if (industryIDs.length) {
      orConditions.push({ industryID: { in: industryIDs } });
    }

    if (orConditions.length === 0) {
      await this.prisma.jobRecommendation.deleteMany({
        where: { userID: user.userID },
      });
      return;
    }

    const jobs = await this.prisma.job.findMany({
      where: {
        isActive: true,
        jobID: { notIn: appliedIDs },
        OR: orConditions,
      },
      include: {
        skills: { select: { skillID: true } },
      },
      // take: 50,
      orderBy: { postedAt: 'desc' },
    });

    const validJobIDs: number[] = [];

    for (const job of jobs) {
      const jobSkillIDs = job.skills.map((s) => s.skillID);
      const totalJobSkills = jobSkillIDs.length || 1;
      const matched = jobSkillIDs.filter((id) => skillIDs.includes(id)).length;
      const matchPercent = Math.round((matched / totalJobSkills) * 100);

      if (matchPercent === 0) continue;

      validJobIDs.push(job.jobID);

      await this.prisma.jobRecommendation.upsert({
        where: {
          userID_jobID: { userID: user.userID, jobID: job.jobID },
        },
        update: { matchPercent },
        create: { userID: user.userID, jobID: job.jobID, matchPercent },
      });
    }

    await this.prisma.jobRecommendation.deleteMany({
      where: {
        userID: user.userID,
        jobID: { notIn: validJobIDs },
      },
    });
  }

  async getRecommendations(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) return [];

    const recs = await this.prisma.jobRecommendation.findMany({
      where: {
        userID: user.userID,
        matchPercent: { gt: 49 },
      },
      orderBy: { matchPercent: 'desc' },
      // take: limit,
      include: {
        job: {
          include: {
            company: { select: { companyName: true, companyLogo: true } },
            skills: { include: { skill: { select: { name: true } } }, take: 5 },
          },
        },
      },
    });

    return recs.map((r) => ({
      jobID: r.job.jobID,
      title: r.job.title,
      companyName: r.job.company.companyName,
      companyLogo: r.job.company.companyLogo,
      location: r.job.location,
      shortLocation: r.job.shortLocation,
      experienceYear: r.job.experienceYear,
      salary: r.job.salary,
      skills: r.job.skills.map((s) => s.skill.name),
      matchPercent: r.matchPercent,
      sourcePlatform: r.job.sourcePlatform,
    }));
  }

  async logUserBehavior(accountID: number, jobID: number, action: string) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
    });
    if (!user) return;

    await this.prisma.userBehavior.create({
      data: { userID: user.userID, jobID, action },
    });
  }

  async getUserStats(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) return null;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const [
      jobMatchCount,
      jobMatchYesterday,
      appliedThisMonth,
      totalApplied,
      responded,
      upcomingInterviews,
    ] = await Promise.all([
      this.prisma.jobRecommendation.count({
        where: {
          userID: user.userID,
          createdAt: { gte: todayStart, lt: todayEnd },
        },
      }),
      this.prisma.jobRecommendation.count({
        where: {
          userID: user.userID,
          createdAt: {
            gte: new Date(todayStart.getTime() - 24 * 60 * 60 * 1000),
            lt: todayStart,
          },
        },
      }),
      this.prisma.applyHistory.count({
        where: { userID: user.userID, appliedAt: { gte: firstOfMonth } },
      }),
      this.prisma.applyHistory.count({
        where: { userID: user.userID },
      }),
      this.prisma.applyHistory.count({
        where: { userID: user.userID, status: { not: 'pending' } },
      }),
      this.prisma.applyHistory.findMany({
        where: { userID: user.userID, status: 'interview' },
        include: {
          job: {
            select: {
              title: true,
              company: { select: { companyName: true } },
            },
          },
        },
        take: 3,
        orderBy: { appliedAt: 'desc' },
      }),
    ]);

    const replyRate =
      totalApplied > 0 ? Math.round((responded / totalApplied) * 100) : 0;
    const delta = jobMatchCount - jobMatchYesterday;

    return {
      jobMatch: {
        count: jobMatchCount,
        delta: delta >= 0 ? `+${delta}` : `${delta}`,
        label: 'so với hôm qua',
      },
      applied: {
        count: appliedThisMonth,
        pending: appliedThisMonth - responded,
        label: 'Đã nộp tháng này',
      },
      replyRate: {
        percent: replyRate,
        label: 'Tỷ lệ phản hồi',
      },
      interviews: {
        count: upcomingInterviews.length,
        next: upcomingInterviews[0]
          ? `${upcomingInterviews[0].job.company.companyName}: sắp tới`
          : null,
        label: 'Phỏng vấn sắp tới',
      },
    };
  }

  async saveJob(accountID: number, jobID: number) {
    const user = await this.prisma.user.findUnique({ where: { accountID } });
    if (!user) throw new Error('User not found');

    const exists = await this.prisma.savedJob.findUnique({
      where: { userID_jobID: { userID: user.userID, jobID } },
    });
    if (exists) return { message: 'Already saved' };

    return this.prisma.savedJob.create({
      data: { userID: user.userID, jobID },
    });
  }

  async unsaveJob(accountID: number, jobID: number) {
    const user = await this.prisma.user.findUnique({ where: { accountID } });
    if (!user) throw new Error('User not found');

    return this.prisma.savedJob.delete({
      where: { userID_jobID: { userID: user.userID, jobID } },
    });
  }

  async getSavedJobs(dto: QueryJobsDto, accountID: number) {
    const user = await this.prisma.user.findUnique({ where: { accountID } });
    const {
      page = 1,
      limit = 9,
    } = dto;

    if (!user) throw new Error('User not found');

    const skip = (page - 1) * limit;

    const total = await this.prisma.savedJob.count({
      where: { userID: user.userID }
    });

    const savedJobs = await this.prisma.savedJob.findMany({
      where: { userID: user.userID },
      include: {
        job: {
          include: { company: true },
        },
      },
      orderBy: { savedAt: 'desc' },
      skip,
      take: limit,
    });

    return {
      data: savedJobs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFilterOptions() {
    const [jobTypes, sources, locations, experiences, industries] =
      await Promise.all([
        this.prisma.job.groupBy({
          by: ['jobType'],
          where: { isActive: true, jobType: { not: null } },
          _count: { jobID: true },
          orderBy: { _count: { jobID: 'desc' } },
        }),
        this.prisma.job.groupBy({
          by: ['sourcePlatform'],
          where: { isActive: true, sourcePlatform: { not: null } },
          _count: { jobID: true },
          orderBy: { _count: { jobID: 'desc' } },
        }),
        this.prisma.job.groupBy({
          by: ['shortLocation'],
          where: { isActive: true, shortLocation: { not: null } },
          _count: { jobID: true },
          orderBy: { _count: { jobID: 'desc' } },
        }),
        this.prisma.job.groupBy({
          by: ['experienceYear'],
          where: { isActive: true, experienceYear: { not: null } },
          _count: { jobID: true },
          orderBy: { _count: { jobID: 'desc' } },
        }),
        this.prisma.industry.findMany({
          include: {
            _count: { select: { jobs: { where: { isActive: true } } } },
          },
          orderBy: { id: 'asc' },
        }),
      ]);

    return {
      jobTypes: jobTypes.map((r) => ({
        value: r.jobType,
        count: r._count.jobID,
      })),
      sources: sources.map((r) => ({
        value: r.sourcePlatform,
        count: r._count.jobID,
      })),
      locations: locations.map((r) => ({
        value: r.shortLocation,
        count: r._count.jobID,
      })),
      experiences: experiences.map((r) => ({
        value: r.experienceYear,
        count: r._count.jobID,
      })),
      industries: industries.map((ind) => ({
        id: ind.id,
        name: ind.name,
        count: ind._count.jobs,
      })),
    };
  }

  async getTrendingKeywords() {
    const skills = await this.prisma.jobSkill.groupBy({
      by: ['skillID'],
      where: { job: { isActive: true } },
      _count: { jobID: true },
      orderBy: { _count: { jobID: 'desc' } },
      take: 50,
    });

    const skillDetails = await this.prisma.skill.findMany({
      where: { skillID: { in: skills.map((s) => s.skillID) } },
      select: { skillID: true, name: true },
    });

    const skillMap = Object.fromEntries(
      skillDetails.map((s) => [s.skillID, s.name]),
    );

    const nameMap = new Map<string, number>();
    for (const s of skills) {
      const name = skillMap[s.skillID];
      if (!name) continue;
      const key = name.trim().toLowerCase();
      nameMap.set(key, (nameMap.get(key) ?? 0) + s._count.jobID);
    }

    const seenKeys = new Set<string>();
    const result: { name: string; count: number }[] = [];

    for (const s of skills) {
      const name = skillMap[s.skillID];
      if (!name) continue;
      const key = name.trim().toLowerCase();
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      result.push({ name: name.trim(), count: nameMap.get(key)! });
      if (result.length >= 15) break;
    }

    return result.sort((a, b) => b.count - a.count);
  }

  async getFilterOptionsBySource(source?: string) {
    const where: Prisma.JobWhereInput = { isActive: true };
    if (source) where.sourcePlatform = source;

    const [jobTypes, industries] = await Promise.all([
      this.prisma.job.groupBy({
        by: ['jobType'],
        where: {
          ...where,
          jobType: { not: null },
        },
        _count: { jobID: true },
        orderBy: { _count: { jobID: 'desc' } },
      }),
      this.prisma.industry.findMany({
        where: { jobs: { some: where } },
        include: { _count: { select: { jobs: { where } } } },
        orderBy: { id: 'asc' },
      }),
    ]);

    const VALID_JOB_TYPES = [
      'Toàn thời gian',
      'Bán thời gian',
      'Thực tập',
      'Thời vụ',
      'Freelance',
      'Remote',
    ];

    const jobTypeMap = new Map<string, number>();

    for (const r of jobTypes) {
      if (!r.jobType) continue;
      if (r.jobType.length > 50) continue;

      const parts = r.jobType.split(',').map((p) => p.trim());
      for (const part of parts) {
        if (!part || part.length > 30) continue;
        const normalized = JOB_TYPE_MAP[part] ?? part;
        if (!VALID_JOB_TYPES.includes(normalized)) continue;
        jobTypeMap.set(
          normalized,
          (jobTypeMap.get(normalized) ?? 0) + r._count.jobID,
        );
      }
    }

    const orderedJobTypes = VALID_JOB_TYPES.filter((v) =>
      jobTypeMap.has(v),
    ).map((v) => ({ value: v, count: jobTypeMap.get(v)! }));

    return {
      jobTypes: orderedJobTypes,
      industries: industries.map((ind) => ({
        id: ind.id,
        name: ind.name,
        count: ind._count.jobs,
      })),
    };
  }
}
