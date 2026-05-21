import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
export declare class AIRecommendationService {
    private prisma;
    private gemini;
    private readonly logger;
    private readonly computingLocks;
    constructor(prisma: PrismaService, gemini: GeminiService);
    computeAndSaveRecommendations(accountID: number): Promise<boolean>;
    private computeMatchScore;
    private computeSkillScore;
    private computeIndustryScore;
    private computeSalaryScore;
    private computeBehaviorScore;
    private jaccardSimilarity;
    private parseSalaryToNumber;
    private scoreJobs;
    private fetchReasonsFromAI;
    private buildDefaultReason;
    private parseReasonArray;
    private buildUserContext;
    private fetchCandidateJobs;
    private saveRecommendations;
    private buildUserBlock;
}
