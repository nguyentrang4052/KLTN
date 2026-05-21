import { GeminiService } from '../gemini/gemini.service';
import { PdfToImageService } from './pdf-to-image.service';
import { CVAnalysisRepository } from './cv-analysis.repository';
import { RedisService } from '../redis/redis.service';
export declare class CvAnalyzerService {
    private readonly geminiService;
    private readonly pdfToImageService;
    private readonly cvAnalysisRepository;
    private readonly redisService;
    private readonly logger;
    private readonly CACHE_TTL;
    prisma: any;
    constructor(geminiService: GeminiService, pdfToImageService: PdfToImageService, cvAnalysisRepository: CVAnalysisRepository, redisService: RedisService);
    analyzeMultipleCVs(files: Express.Multer.File[], userID: number, enableVerification?: boolean): Promise<any>;
    mapCVToProfile(cvBuilderId: number, userId: number): Promise<{
        fullName: string | null;
        phone: string | null;
        address: string | null;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
    }>;
    getUserCVHistory(userId: number): Promise<{
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        fileHash: string;
        filename: string;
    }[]>;
    private analyzeSingleFile;
    private isVietnameseTextGarbled;
    private validateAndFormatResult;
    mapLocalCVToProfile(cvData: {
        personalInfo?: {
            fullName?: string;
            phone?: string;
            address?: string;
            email?: string;
            linkedin?: string;
            portfolio?: string;
        };
        experiences?: Array<{
            company?: string;
            position?: string;
            duration?: string;
            description?: string;
        }>;
        education?: any[];
        skills?: any[];
        summary?: string;
    }, userId: number): Promise<{
        fullName: string | null;
        phone: string | null;
        address: string | null;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
    }>;
    private inferCareerRuleBased;
    getCVById(cvId: number, userId: number): Promise<{
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        fileHash: string;
        filename: string;
    }>;
}
