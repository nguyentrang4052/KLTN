import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';

interface UserContext {
  skills: string[];
  profile: {
    jobTitle: string | null;
    careerLevel: string | null;
    experienceYear: string | null;
    expectedSalary: string | null;
    workingType: string | null;
    industry: string | null;
  };
  behaviors: {
    recentViewedTitles: string[];
    recentViewedIndustries: string[];
    savedJobTitles: string[];
    appliedJobTitles: string[];
  };
  cvSummary: string | null;
}

interface JobCandidate {
  jobID: number;
  title: string | null;
  description: string | null;
  requirement: string | null;
  salary: string | null;
  jobType: string | null;
  experienceYear: string | null;
  industryName: string | null;
  companyName: string;
  skills: string[];
}

interface AIScoreResult {
  jobID: number;
  matchPercent: number;
  reason: string;
}

@Injectable()
export class AIRecommendationService {
  private readonly logger = new Logger(AIRecommendationService.name);
  private readonly computingLocks = new Set<number>();

  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
  ) {}

  async computeAndSaveRecommendations(accountID: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) return false;

    const userID = user.userID;

    if (this.computingLocks.has(userID)) {
      this.logger.log(`Skipping — already computing for userID=${userID}`);
      return false;
    }

    const latest = await this.prisma.jobRecommendation.findFirst({
      where: { userID },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const ONE_HOUR = 60 * 60 * 1000;
    // const ONE_HOUR = 1 * 60 * 1000;
    if (latest && Date.now() - latest.createdAt.getTime() < ONE_HOUR) {
      this.logger.log(`Skipping recompute — data is fresh (userID=${userID})`);
      return false;
    }

    this.computingLocks.add(userID);
    try {
      const userContext = await this.buildUserContext(userID);
      const hasContext =
        userContext.skills.length > 0 ||
        userContext.profile.jobTitle ||
        userContext.behaviors.recentViewedTitles.length > 0 ||
        userContext.cvSummary;

      if (!hasContext) {
        await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
        return false;
      }

      const candidates = await this.fetchCandidateJobs(userID, userContext);
      if (candidates.length === 0) {
        await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
        return false;
      }

      const scores = await this.scoreJobsWithAI(userContext, candidates);
      await this.saveRecommendations(userID, scores);
      return scores.length > 0;
    } finally {
      this.computingLocks.delete(userID);
    }
  }

  private async buildUserContext(userID: number): Promise<UserContext> {
    const [
      skillRows,
      profileRow,
      behaviorRows,
      savedRows,
      appliedRows,
      cvRows,
    ] = await Promise.all([
      this.prisma.userSkill.findMany({
        where: { userID },
        include: { skill: { select: { name: true } } },
      }),
      this.prisma.userProfile.findFirst({
        where: { userID },
        include: { industry: { select: { name: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.userBehavior.findMany({
        where: { userID },
        include: {
          job: {
            select: {
              title: true,
              industry: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      this.prisma.savedJob.findMany({
        where: { userID },
        include: { job: { select: { title: true } } },
        orderBy: { savedAt: 'desc' },
        take: 10,
      }),
      this.prisma.applyHistory.findMany({
        where: { userID },
        include: { job: { select: { title: true } } },
        orderBy: { appliedAt: 'desc' },
        take: 10,
      }),
      this.prisma.cV.findMany({
        where: { userID },
        select: { title: true },
        take: 3,
      }),
    ]);

    const recentViewedTitles = [
      ...new Set(
        behaviorRows
          .filter((b) => b.action === 'view' && b.job.title)
          .map((b) => b.job.title as string)
          .slice(0, 10),
      ),
    ];

    const recentViewedIndustries = [
      ...new Set(
        behaviorRows
          .map((b) => b.job.industry?.name)
          .filter((n): n is string => !!n),
      ),
    ];

    return {
      skills: skillRows.map((s) => s.skill.name),
      profile: {
        jobTitle: profileRow?.jobTitle ?? null,
        careerLevel: profileRow?.careerLevel ?? null,
        experienceYear: profileRow?.experienceYear ?? null,
        expectedSalary: profileRow?.expectedSalary ?? null,
        workingType: profileRow?.workingType ?? null,
        industry: profileRow?.industry?.name ?? null,
      },
      behaviors: {
        recentViewedTitles,
        recentViewedIndustries,
        savedJobTitles: savedRows
          .map((s) => s.job.title)
          .filter((t): t is string => !!t),
        appliedJobTitles: appliedRows
          .map((a) => a.job.title)
          .filter((t): t is string => !!t),
      },
      cvSummary:
        cvRows.length > 0
          ? `User has CVs titled: ${cvRows.map((c) => c.title).join(', ')}`
          : null,
    };
  }

  private async fetchCandidateJobs(
    userID: number,
    ctx: UserContext,
  ): Promise<JobCandidate[]> {
    const appliedIDs = (
      await this.prisma.applyHistory.findMany({
        where: { userID },
        select: { jobID: true },
      })
    ).map((a) => a.jobID);

    const industryNames = [
      ...new Set([
        ...ctx.behaviors.recentViewedIndustries,
        ...(ctx.profile.industry ? [ctx.profile.industry] : []),
      ]),
    ];
    const matchedIndustries = await this.prisma.industry.findMany({
      where: { name: { in: industryNames } },
      select: { id: true },
    });
    const industryIDs = matchedIndustries.map((i) => i.id);

    const skillNames = ctx.skills;
    const matchedSkills = await this.prisma.skill.findMany({
      where: { name: { in: skillNames } },
      select: { skillID: true },
    });
    const skillIDs = matchedSkills.map((s) => s.skillID);

    const orConditions: any[] = [];
    if (skillIDs.length)
      orConditions.push({ skills: { some: { skillID: { in: skillIDs } } } });
    if (industryIDs.length)
      orConditions.push({ industryID: { in: industryIDs } });
    if (ctx.profile.jobTitle)
      orConditions.push({
        title: { contains: ctx.profile.jobTitle, mode: 'insensitive' },
      });

    const where: any =
      orConditions.length > 0
        ? {
            isActive: true,
            deadline: { gt: new Date() },
            jobID: { notIn: appliedIDs },
            OR: orConditions,
          }
        : {
            isActive: true,
            deadline: { gt: new Date() },
            jobID: { notIn: appliedIDs },
          };

    const jobs = await this.prisma.job.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      take: 60, // Send up to 60 to Claude; it will filter further
      include: {
        company: { select: { companyName: true } },
        industry: { select: { name: true } },
        skills: { include: { skill: { select: { name: true } } } },
      },
    });

    return jobs.map((j) => ({
      jobID: j.jobID,
      title: j.title,
      description: j.description ? j.description.slice(0, 300) : null,
      requirement: j.requirement ? j.requirement.slice(0, 300) : null,
      salary: j.salary,
      jobType: j.jobType,
      experienceYear: j.experienceYear,
      industryName: j.industry?.name ?? null,
      companyName: j.company.companyName,
      skills: j.skills.map((s) => s.skill.name),
    }));
  }

  private async scoreJobsWithAI(
    ctx: UserContext,
    jobs: JobCandidate[],
  ): Promise<AIScoreResult[]> {
    try {
      const userBlock = this.buildUserBlock(ctx);
      const jobsBlock = JSON.stringify(
        jobs.map((j) => ({
          id: j.jobID,
          title: j.title,
          company: j.companyName,
          industry: j.industryName,
          skills: j.skills,
          experience: j.experienceYear,
          salary: j.salary,
          jobType: j.jobType,
          desc: j.description,
          req: j.requirement,
        })),
      );

      const prompt = `You are a career counselor AI. Score how well each job matches the candidate.


## Candidate profile
${userBlock}

## Job list (JSON)
${jobsBlock}

## Instructions
- Score each job from 0–100 based on overall fit (skills match, career level, industry relevance, salary expectations, job type preference, behavioral signals).
- Only include jobs with score >= 50.
- Return ONLY a valid JSON array. No markdown, no explanation outside JSON.
- Format: [{"jobID": number, "matchPercent": number, "reason": "1 sentence max"}]
- Reason must be in Vietnamese.`;

      const raw = await this.gemini.scoreJobs(prompt);
      if (Array.isArray(raw)) return this.normalizeScores(raw);
      return this.parseScores(
        typeof raw === 'string' ? raw : JSON.stringify(raw),
      );
    } catch (err) {
      const is429 =
        err?.statusCode === 429 ||
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('Too Many Requests');

      if (is429) {
        this.logger.warn(
          'Gemini quota exceeded — falling back to skill-based scoring',
        );
        return this.fallbackScoring(ctx, jobs);
      }
      throw err;
    }
  }

  private fallbackScoring(
    ctx: UserContext,
    jobs: JobCandidate[],
  ): AIScoreResult[] {
    const userSkills = new Set(ctx.skills.map((s) => s.toLowerCase()));

    return jobs
      .map((job) => {
        const jobSkills = job.skills.map((s) => s.toLowerCase());
        const matched = jobSkills.filter((s) => userSkills.has(s)).length;
        const total = jobSkills.length || 1;
        const matchPercent = Math.round((matched / total) * 100);
        return {
          jobID: job.jobID,
          matchPercent,
          reason: 'Dựa trên kỹ năng phù hợp',
        };
      })
      .filter((r) => r.matchPercent >= 50);
  }

  private async saveRecommendations(
    userID: number,
    scores: AIScoreResult[],
  ): Promise<void> {
    if (scores.length === 0) {
      await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
      return;
    }

    const validJobIDs: number[] = [];

    for (const s of scores) {
      validJobIDs.push(s.jobID);
      await this.prisma.jobRecommendation.upsert({
        where: { userID_jobID: { userID, jobID: s.jobID } },
        update: { matchPercent: s.matchPercent, reason: s.reason},
        create: {
          userID,
          jobID: s.jobID,
          matchPercent: s.matchPercent,
          reason: s.reason,
        },
      });
    }
    await this.prisma.jobRecommendation.deleteMany({
      where: { userID, jobID: { notIn: validJobIDs } },
    });

    this.logger.log(
      `Saved ${scores.length} AI recommendations for userID=${userID}`,
    );
  }

  private buildUserBlock(ctx: UserContext): string {
    const lines: string[] = [];

    if (ctx.profile.jobTitle)
      lines.push(`- Desired role: ${ctx.profile.jobTitle}`);
    if (ctx.profile.careerLevel)
      lines.push(`- Career level: ${ctx.profile.careerLevel}`);
    if (ctx.profile.experienceYear)
      lines.push(`- Experience: ${ctx.profile.experienceYear}`);
    if (ctx.profile.industry)
      lines.push(`- Preferred industry: ${ctx.profile.industry}`);
    if (ctx.profile.expectedSalary)
      lines.push(`- Expected salary: ${ctx.profile.expectedSalary}`);
    if (ctx.profile.workingType)
      lines.push(`- Working type preference: ${ctx.profile.workingType}`);
    if (ctx.skills.length) lines.push(`- Skills: ${ctx.skills.join(', ')}`);
    if (ctx.cvSummary) lines.push(`- CV: ${ctx.cvSummary}`);

    if (ctx.behaviors.recentViewedTitles.length)
      lines.push(
        `- Recently viewed jobs: ${ctx.behaviors.recentViewedTitles.join(', ')}`,
      );
    if (ctx.behaviors.savedJobTitles.length)
      lines.push(`- Saved jobs: ${ctx.behaviors.savedJobTitles.join(', ')}`);
    if (ctx.behaviors.appliedJobTitles.length)
      lines.push(`- Applied to: ${ctx.behaviors.appliedJobTitles.join(', ')}`);

    return lines.join('\n');
  }

  private normalizeScores(arr: any[]): AIScoreResult[] {
    return arr
      .filter(
        (item: any) =>
          typeof item.jobID === 'number' &&
          typeof item.matchPercent === 'number',
      )
      .map((item: any) => ({
        jobID: item.jobID,
        matchPercent: Math.min(100, Math.max(0, Math.round(item.matchPercent))),
        reason: item.reason ?? '',
      }));
  }

  private parseScores(raw: string): AIScoreResult[] {
    try {
      const clean = raw
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const arr = JSON.parse(clean);
      if (!Array.isArray(arr)) return [];

      return arr
        .filter(
          (item: any) =>
            typeof item.jobID === 'number' &&
            typeof item.matchPercent === 'number',
        )
        .map((item: any) => ({
          jobID: item.jobID,
          matchPercent: Math.min(100, Math.max(0, Math.round(item.matchPercent))),
          reason: item.reason ?? '',
        }));
    } catch (err) {
      this.logger.error('Failed to parse AI score response', err);
      return [];
    }
  }
}