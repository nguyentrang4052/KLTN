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
  ) { }

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

    const today = new Date().toISOString().slice(0, 10);
    const month = new Date().toISOString().slice(0, 7);

    const quota = await this.prisma.userQuota.findFirst({
      where: { userID, month },
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

      const scores = await this.scoreJobs(userContext, candidates);
      if (scores.length === 0) {
        await this.prisma.jobRecommendation.deleteMany({ where: { userID } });
        return false;
      }

      const existingRecs = await this.prisma.jobRecommendation.findMany({
        where: { userID },
        select: { jobID: true, matchPercent: true },
      });

      const existingMap = new Map(existingRecs.map((r) => [r.jobID, r]));

      const hasChanged =
        existingRecs.length !== scores.length ||
        scores.some((s) => {
          const old = existingMap.get(s.jobID);
          if (!old) return true;
          return old.matchPercent !== s.matchPercent;
        });

      if (!hasChanged) {
        this.logger.log(`No changes for userID=${userID}`);
        return false;
      }

      await this.saveRecommendations(userID, scores);
      return true;
    } finally {
      this.computingLocks.delete(userID);
    }
  }

  private computeMatchScore(ctx: UserContext, job: JobCandidate): number {
    const skillScore = this.computeSkillScore(ctx, job);
    const industryScore = this.computeIndustryScore(ctx, job);
    const salaryScore = this.computeSalaryScore(ctx, job);
    const behaviorScore = this.computeBehaviorScore(ctx, job);

    const total =
      skillScore * 0.5 +
      industryScore * 0.2 +
      salaryScore * 0.2 +
      behaviorScore * 0.1;

    this.logger.debug(
      `jobID=${job.jobID} skill=${skillScore} industry=${industryScore} salary=${salaryScore} behavior=${behaviorScore} total=${Math.round(total)}`,
    );

    return Math.round(Math.min(100, Math.max(0, total)));
  }

  private computeSkillScore(ctx: UserContext, job: JobCandidate): number {
    const userSkills = new Set(ctx.skills.map((s) => s.toLowerCase().trim()));

    if (job.skills.length > 0) {
      const jobSkills = job.skills.map((s) => s.toLowerCase().trim());
      const matched = jobSkills.filter((s) => userSkills.has(s)).length;
      return Math.round((matched / jobSkills.length) * 100);
    }

    // Đếm số skill của user xuất hiện trong văn bản mô tả job
    if (userSkills.size === 0) return 0;

    const jobText = [job.description ?? '', job.requirement ?? '']
      .join(' ')
      .toLowerCase();

    if (!jobText.trim()) return 0;

    const matchedInText = [...userSkills].filter((skill) =>
      // Dùng word-boundary để "java" không khớp "javascript"
      new RegExp(`(?<![a-z0-9])${escapeRegex(skill)}(?![a-z0-9])`, 'i').test(
        jobText,
      ),
    ).length;

    return Math.round(Math.min(80, (matchedInText / userSkills.size) * 100));
  }

  private computeIndustryScore(ctx: UserContext, job: JobCandidate): number {
    const normalize = (s: string) => s.toLowerCase().trim();
    const jobIndustry = job.industryName ? normalize(job.industryName) : null;

    if (!jobIndustry) return 0;

    if (ctx.profile.industry && normalize(ctx.profile.industry) === jobIndustry) {
      return 100;
    }

    if (
      ctx.behaviors.recentViewedIndustries.some(
        (i) => normalize(i) === jobIndustry,
      )
    ) {
      return 70;
    }

    return 0;
  }

  private computeSalaryScore(ctx: UserContext, job: JobCandidate): number {
    const expectedNum = this.parseSalaryToNumber(ctx.profile.expectedSalary);
    const jobSalaryNum = this.parseSalaryToNumber(job.salary);

    if (!expectedNum || !jobSalaryNum) return 50;

    const ratio = jobSalaryNum / expectedNum;
    return ratio >= 0.8 ? 100 : ratio >= 0.6 ? 60 : 20;
  }

  private computeBehaviorScore(ctx: UserContext, job: JobCandidate): number {
    const titleLower = (job.title ?? '').toLowerCase();

    const isSaved = ctx.behaviors.savedJobTitles.some(
      (t) => this.jaccardSimilarity(titleLower, t.toLowerCase()) >= 0.3,
    );
    if (isSaved) return 100;

    const isViewed = ctx.behaviors.recentViewedTitles.some(
      (t) => this.jaccardSimilarity(titleLower, t.toLowerCase()) >= 0.3,
    );
    if (isViewed) return 70;

    return 0;
  }

  private jaccardSimilarity(a: string, b: string): number {
    const tokensA = new Set(tokenize(a));
    const tokensB = new Set(tokenize(b));

    if (tokensA.size === 0 && tokensB.size === 0) return 1;
    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    const intersection = [...tokensA].filter((t) => tokensB.has(t)).length;
    const union = new Set([...tokensA, ...tokensB]).size;

    return intersection / union;
  }

  private parseSalaryToNumber(salary: string | null): number | null {
    if (!salary) return null;

    // bỏ dấu phẩy phân cách nghìn
    const cleaned = salary.replace(/,/g, '');
    const matches = cleaned.match(/\d+(\.\d+)?/g);
    if (!matches || matches.length === 0) return null;

    const nums = matches.map((m) => parseFloat(m)).filter((n) => !isNaN(n) && n > 0);
    if (nums.length === 0) return null;

    // Lấy MAX cho job có khoảng lương
    return Math.max(...nums);
  }

  private async scoreJobs(
    ctx: UserContext,
    jobs: JobCandidate[],
  ): Promise<AIScoreResult[]> {
    const scored = jobs
      .map((job) => ({ job, score: this.computeMatchScore(ctx, job) }))
      .filter(({ score }) => score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    if (scored.length === 0) return [];

    this.logger.log(
      `Formula scored ${scored.length} jobs >= 50% for AI reason generation`,
    );

    try {
      const reasons = await this.fetchReasonsFromAI(ctx, scored);

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
      : this.parseReasonArray(
        typeof raw === 'string' ? raw : JSON.stringify(raw),
      );

    return Object.fromEntries(
      arr
        .filter(
          (r) => typeof r.jobID === 'number' && typeof r.reason === 'string',
        )
        .map((r) => [r.jobID, r.reason]),
    );
  }

  private buildDefaultReason(
    ctx: UserContext,
    job: JobCandidate,
    score: number,
  ): string {
    const parts: string[] = [];

    // Skill match
    const userSkills = new Set(ctx.skills.map((s) => s.toLowerCase()));
    const matchedSkills = job.skills.filter((s) =>
      userSkills.has(s.toLowerCase()),
    );
    if (matchedSkills.length > 0) {
      parts.push(`khớp kỹ năng ${matchedSkills.slice(0, 3).join(', ')}`);
    } else if (job.skills.length === 0) {
      // Khi không có skill tag, thử mention skill từ text
      const jobText = [job.description ?? '', job.requirement ?? '']
        .join(' ')
        .toLowerCase();
      const mentionedSkills = ctx.skills
        .filter((s) =>
          new RegExp(
            `(?<![a-z0-9])${escapeRegex(s.toLowerCase())}(?![a-z0-9])`,
            'i',
          ).test(jobText),
        )
        .slice(0, 2);
      if (mentionedSkills.length > 0) {
        parts.push(`yêu cầu ${mentionedSkills.join(', ')} phù hợp hồ sơ`);
      }
    }

    // Industry match
    const normalize = (s: string) => s.toLowerCase().trim();
    const jobIndustry = job.industryName ? normalize(job.industryName) : null;
    if (jobIndustry && ctx.profile.industry && normalize(ctx.profile.industry) === jobIndustry) {
      parts.push(`đúng ngành ${job.industryName}`);
    } else if (
      jobIndustry &&
      ctx.behaviors.recentViewedIndustries.some((i) => normalize(i) === jobIndustry)
    ) {
      parts.push(`ngành bạn quan tâm`);
    }

    // Salary match
    const expectedNum = this.parseSalaryToNumber(ctx.profile.expectedSalary);
    const jobSalaryNum = this.parseSalaryToNumber(job.salary);
    if (expectedNum && jobSalaryNum && jobSalaryNum >= expectedNum * 0.8) {
      parts.push(`mức lương phù hợp kỳ vọng`);
    }

    // Behavior match
    const titleLower = (job.title ?? '').toLowerCase();
    if (
      ctx.behaviors.savedJobTitles.some(
        (t) => this.jaccardSimilarity(titleLower, t.toLowerCase()) >= 0.3,
      )
    ) {
      parts.push(`tương tự việc bạn đã lưu`);
    } else if (
      ctx.behaviors.recentViewedTitles.some(
        (t) => this.jaccardSimilarity(titleLower, t.toLowerCase()) >= 0.3,
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
      // Tăng giới hạn text để text-match skill chính xác hơn
      description: j.description ? j.description.slice(0, 600) : null,
      requirement: j.requirement ? j.requirement.slice(0, 600) : null,
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

function tokenize(text: string): string[] {
  const STOP_WORDS = new Set([
    'and', 'or', 'the', 'a', 'an', 'in', 'of', 'for', 'to', 'with',
    'on', 'at', 'by', 'from', 'as', 'is', 'are', 'be', 'was', 'were',
    'it', 'its', 'this', 'that', 'we', 'our', 'you', 'your',
    'và', 'hoặc', 'của', 'cho', 'với', 'tại', 'là', 'có', 'các', 'trong',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
