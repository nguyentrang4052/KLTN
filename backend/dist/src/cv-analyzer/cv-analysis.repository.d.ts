import { PrismaService } from './../../prisma/prisma.service';
import { CVAnalysisResultDto } from './dto/cv-analysis-result.dto';
export declare class CVAnalysisRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByFileHash(fileHash: string): Promise<{
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        fileHash: string;
        filename: string;
    } | null>;
    findById(id: number): Promise<{
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        fileHash: string;
        filename: string;
    } | null>;
    findByUser(userID: number): Promise<{
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        fileHash: string;
        filename: string;
    }[]>;
    create(userID: number, fileHash: string, filename: string, result: CVAnalysisResultDto): Promise<{
        createdAt: Date;
        result: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        fileHash: string;
        filename: string;
    }>;
    mapToUserProfile(cvBuilderId: number, userId: number): Promise<{
        fullName: string | null;
        phone: string | null;
        address: string | null;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
    }>;
    private calculateExperienceYears;
    private calculateCareerLevel;
    private syncUserSkills;
    mapLocalDataToUserProfile(userId: number, data: {
        fullName?: string;
        phone?: string;
        address?: string;
        jobTitle?: string;
        experienceYear?: string;
        careerLevel?: string;
    }): Promise<{
        fullName: string | null;
        phone: string | null;
        address: string | null;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
    }>;
}
