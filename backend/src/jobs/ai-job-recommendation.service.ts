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
    this.logger.log(`Computing for accountID=${accountID}`);
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) {
      this.logger.log(`No user found for accountID=${accountID}`);
      return false;
    }

    const userID = user.userID;
    this.logger.log(`userID=${userID}`);

    const today = new Date().toISOString().slice(0, 10);
    const month = new Date().toISOString().slice(0, 7);

    const quota = await this.prisma.userQuota.findFirst({
      where: {
        userID,
        month,
      },
    });

    if (
      quota &&
      quota.jobSuggestResetDate === today &&
      quota.jobSuggestUsedToday >= quota.jobSuggestPerDay
    ) {
      this.logger.log(`Skip recompute — quota exceeded userID=${userID}`);
      return false;
    }

    if (this.computingLocks.has(userID)) {
      this.logger.log(`Skipping — already computing for userID=${userID}`);
      return false;
    }

    const FRESH_MS = 1 * 60 * 1000;
    const freshThreshold = new Date(Date.now() - FRESH_MS);
    const latest = await this.prisma.jobRecommendation.findFirst({
      where: { userID },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });

    this.logger.log(`latest=${latest?.updatedAt}, threshold=${freshThreshold}`);
    if (latest && latest.updatedAt > freshThreshold) {
      this.logger.log(`Skipping recompute — data is fresh (userID=${userID})`);
      return false;
    }

    this.computingLocks.add(userID);
    try {
      const userContext = await this.buildUserContext(userID);
      this.logger.log(`hasContext check: skills=${userContext.skills.length}, jobTitle=${userContext.profile.jobTitle}`);
      const hasContext =
        userContext.skills.length > 0 ||
        userContext.profile.jobTitle ||
        userContext.behaviors.recentViewedTitles.length > 0 ||
        userContext.cvSummary;

      this.logger.log(`hasContext=${hasContext}`);

      if (!hasContext) {
        this.logger.log(`No context, deleting recs for userID=${userID}`);
        await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
        return false;
      }

      const candidates = await this.fetchCandidateJobs(userID, userContext);
      this.logger.log(`candidates=${candidates.length}`);
      if (candidates.length === 0) {
        await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
        return false;
      }

      const scores = await this.scoreJobs(userContext, candidates);
      this.logger.log(`scores=${scores.length}`);
      if (scores.length === 0) {
        await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
        return false;
      }

      // So sánh với recs hiện tại trước khi save
      const existingRecs = await this.prisma.jobRecommendation.findMany({
        where: { userID },
        select: {
          jobID: true,
          matchPercent: true,
          reason: true,
        },
      });

      // Chỉ tính changed khi có job mới
      const existingMap = new Map(existingRecs.map((r) => [r.jobID, r]));

      const hasChanged =
        existingRecs.length !== scores.length ||
        scores.some((s) => {
          const old = existingMap.get(s.jobID);

          if (!old) return true;

          return old.matchPercent !== s.matchPercent;
        });
      this.logger.log(
        `hasChanged=${hasChanged} (existing=${existingRecs.length}, new=${scores.length})`,
      );

      if (!hasChanged) {
        this.logger.log(`No new recommendations for userID=${userID}`);
        return false;
      }

      await this.saveRecommendations(userID, scores);
      return true;
    } finally {
      this.computingLocks.delete(userID);
    }
  }

  //  matchPercent = skillScore    × 0.5
  //              + industryScore × 0.2
  //              + salaryScore   × 0.2
  //              + behaviorScore × 0.1

  private computeMatchScore(ctx: UserContext, job: JobCandidate): number {
    // Skill score
    const userSkills = new Set(ctx.skills.map((s) => s.toLowerCase()));
    const jobSkills = job.skills.map((s) => s.toLowerCase());
    const matchedSkills = jobSkills.filter((s) => userSkills.has(s)).length;
    const skillScore = jobSkills.length
      ? (matchedSkills / jobSkills.length) * 100
      : 50; // Không có skill tag, trung lập

    // Industry score
    //    Khớp ngành trong profile = 100, thấy trong lịch sử xem = 70, không khớp = 0
    const industryScore =
      ctx.profile.industry && ctx.profile.industry === job.industryName
        ? 100
        : ctx.behaviors.recentViewedIndustries.includes(job.industryName ?? '')
          ? 70
          : 0;

    // Salary score
    // So sánh lương kỳ vọng của user với lương job
    // Job lương >= 80% kỳ vọng = 100, >= 60% = 60, < 60% = 20, không có data = 50
    const expectedNum = this.parseSalaryToNumber(ctx.profile.expectedSalary);
    const jobSalaryNum = this.parseSalaryToNumber(job.salary);
    let salaryScore: number;
    if (!expectedNum || !jobSalaryNum) {
      salaryScore = 50;
    } else {
      const ratio = jobSalaryNum / expectedNum;
      salaryScore = ratio >= 0.8 ? 100 : ratio >= 0.6 ? 60 : 20;
    }

    // Behavior score
    // Job đã lưu = 100, job đã xem (title tương tự) = 70, không có = 0
    const titleLower = (job.title ?? '').toLowerCase();
    const isSaved = ctx.behaviors.savedJobTitles.some(
      (t) =>
        titleLower.includes(t.toLowerCase()) ||
        t.toLowerCase().includes(titleLower),
    );
    const isViewed = ctx.behaviors.recentViewedTitles.some(
      (t) =>
        titleLower.includes(t.toLowerCase()) ||
        t.toLowerCase().includes(titleLower),
    );
    const behaviorScore = isSaved ? 100 : isViewed ? 70 : 0;

    const total =
      skillScore * 0.5 +
      industryScore * 0.2 +
      salaryScore * 0.2 +
      behaviorScore * 0.1;

    return Math.round(Math.min(100, Math.max(0, total)));
  }

  private parseSalaryToNumber(salary: string | null): number | null {
    if (!salary) return null;

    const match = salary.match(/\d+/);
    if (!match) return null;

    const num = parseInt(match[0], 10);

    return isNaN(num) || num === 0 ? null : num;
  }

  private async scoreJobs(
    ctx: UserContext,
    jobs: JobCandidate[],
  ): Promise<AIScoreResult[]> {
    const scored = jobs
      .map((job) => ({ job, score: this.computeMatchScore(ctx, job) }))
      .filter(({ score }) => score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30); // Giữ top 30 để Gemini viết reason

    if (scored.length === 0) return [];

    this.logger.log(
      `Formula scored ${scored.length} jobs >= 50% for AI reason generation`,
    );

    // Gửi top jobs lên Gemini chỉ để lấy reason
    try {
      const reasons = await this.fetchReasonsFromAI(ctx, scored);

      // Merge: điểm từ công thức, reason từ Gemini
      return scored.map(({ job, score }) => ({
        jobID: job.jobID,
        matchPercent: score,
        reason: reasons[job.jobID] ?? this.buildDefaultReason(ctx, job, score),
      }));
    } catch (err) {
      this.logger.warn(
        'Gemini reason generation failed — using default reasons',
        err?.message,
      );
      // vẫn dùng điểm công thức, chỉ reason là mặc định
      return scored.map(({ job, score }) => ({
        jobID: job.jobID,
        matchPercent: score,
        reason: this.buildDefaultReason(ctx, job, score),
      }));
    }
  }

  private async fetchReasonsFromAI(
    ctx: UserContext,
    scored: { job: JobCandidate; score: number }[],
  ): Promise<Record<number, string>> {
    const userBlock = this.buildUserBlock(ctx);
    const jobsBlock = JSON.stringify(
      scored.map(({ job, score }) => ({
        jobID: job.jobID,
        title: job.title,
        company: job.companyName,
        industry: job.industryName,
        skills: job.skills,
        experience: job.experienceYear,
        salary: job.salary,
        matchPercent: score,
      })),
    );

    const prompt = `Bạn là chuyên viên tư vấn nghề nghiệp.
Dưới đây là thông tin ứng viên và danh sách việc làm đã được tính điểm phù hợp sẵn.
Nhiệm vụ của bạn: viết 1 câu lý do ngắn gọn (tiếng Việt) giải thích tại sao job đó phù hợp với ứng viên.

## Thông tin ứng viên
${userBlock}

## Danh sách job (đã có matchPercent)
${jobsBlock}

## Yêu cầu
- Trả về ONLY JSON array, không markdown, không giải thích ngoài JSON.
- Format: [{"jobID": number, "reason": "1 câu tiếng Việt"}]
- Reason dựa trên điểm nổi bật nhất: skill, ngành, mức lương, kinh nghiệm.`;

    const raw = await this.gemini.scoreJobs(prompt);
    const arr: { jobID: number; reason: string }[] = Array.isArray(raw)
      ? raw
      : this.parseReasonArray(typeof raw === 'string' ? raw : JSON.stringify(raw));

    return Object.fromEntries(
      arr
        .filter((r) => typeof r.jobID === 'number' && typeof r.reason === 'string')
        .map((r) => [r.jobID, r.reason]),
    );
  }

  private buildDefaultReason(
    ctx: UserContext,
    job: JobCandidate,
    score: number,
  ): string {
    const parts: string[] = [];

    const userSkills = new Set(ctx.skills.map((s) => s.toLowerCase()));
    const matchedSkills = job.skills.filter((s) =>
      userSkills.has(s.toLowerCase()),
    );
    if (matchedSkills.length > 0) {
      parts.push(`khớp kỹ năng ${matchedSkills.slice(0, 3).join(', ')}`);
    }

    if (ctx.profile.industry === job.industryName && job.industryName) {
      parts.push(`đúng ngành ${job.industryName}`);
    } else if (
      ctx.behaviors.recentViewedIndustries.includes(job.industryName ?? '')
    ) {
      parts.push(`ngành bạn quan tâm`);
    }

    const expectedNum = this.parseSalaryToNumber(ctx.profile.expectedSalary);
    const jobSalaryNum = this.parseSalaryToNumber(job.salary);
    if (expectedNum && jobSalaryNum && jobSalaryNum >= expectedNum * 0.8) {
      parts.push(`mức lương phù hợp kỳ vọng`);
    }

    if (
      ctx.behaviors.savedJobTitles.some((t) =>
        (job.title ?? '').toLowerCase().includes(t.toLowerCase()),
      )
    ) {
      parts.push(`tương tự việc bạn đã lưu`);
    } else if (
      ctx.behaviors.recentViewedTitles.some((t) =>
        (job.title ?? '').toLowerCase().includes(t.toLowerCase()),
      )
    ) {
      parts.push(`tương tự việc bạn đã xem`);
    }

    if (parts.length === 0) {
      return `Phù hợp ${score}% dựa trên hồ sơ của bạn.`;
    }

    return `Phù hợp ${score}% — ${parts.join(', ')}.`;
  }

  private parseReasonArray(raw: string): { jobID: number; reason: string }[] {
    try {
      const clean = raw
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const arr = JSON.parse(clean);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  private async buildUserContext(userID: number): Promise<UserContext> {
    const [skillRows, profileRow, behaviorRows, savedRows] = await Promise.all([
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
            select: { title: true, industry: { select: { name: true } } },
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
    ]);

    const recentViewedTitles: string[] = [
      ...new Set(
        behaviorRows
          .filter((b) => b.action === 'view' && b.job.title)
          .map((b) => b.job.title as string)
          .slice(0, 10),
      ),
    ];

    const recentViewedIndustries: string[] = [
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
        appliedJobTitles: [],
      },
      cvSummary: null,
    };
  }

  private async fetchCandidateJobs(
    userID: number,
    ctx: UserContext,
  ): Promise<JobCandidate[]> {
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

    const matchedSkills = await this.prisma.skill.findMany({
      where: { name: { in: ctx.skills } },
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
          OR: orConditions,
        }
        : {
          isActive: true,
          deadline: { gt: new Date() },
        };

    const jobs = await this.prisma.job.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      take: 100,
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
        update: {
          matchPercent: s.matchPercent,
          reason: s.reason,
          // createdAt: new Date(),
        },
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
      `Saved ${scores.length} recommendations for userID=${userID}`,
    );
  }

  private buildUserBlock(ctx: UserContext): string {
    const lines: string[] = [];
    if (ctx.profile.jobTitle)
      lines.push(`- Vị trí mong muốn: ${ctx.profile.jobTitle}`);
    if (ctx.profile.careerLevel)
      lines.push(`- Cấp bậc: ${ctx.profile.careerLevel}`);
    if (ctx.profile.experienceYear)
      lines.push(`- Kinh nghiệm: ${ctx.profile.experienceYear}`);
    if (ctx.profile.industry)
      lines.push(`- Ngành ưu tiên: ${ctx.profile.industry}`);
    if (ctx.profile.expectedSalary)
      lines.push(`- Lương kỳ vọng: ${ctx.profile.expectedSalary}`);
    if (ctx.profile.workingType)
      lines.push(`- Hình thức làm việc: ${ctx.profile.workingType}`);
    if (ctx.skills.length) lines.push(`- Kỹ năng: ${ctx.skills.join(', ')}`);
    if (ctx.behaviors.recentViewedTitles.length)
      lines.push(
        `- Jobs đã xem: ${ctx.behaviors.recentViewedTitles.join(', ')}`,
      );
    if (ctx.behaviors.savedJobTitles.length)
      lines.push(`- Jobs đã lưu: ${ctx.behaviors.savedJobTitles.join(', ')}`);
    return lines.join('\n');
  }
}
