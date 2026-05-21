import { CvAnalyzerService } from './cv-analyzer.service';
import { MapFromLocalCvDto } from './dto/map-from-local-cv.dto';
export declare class CvAnalyzerController {
    private readonly cvAnalyzerService;
    constructor(cvAnalyzerService: CvAnalyzerService);
    analyzeCV(req: any, files: Express.Multer.File[], verify?: string): Promise<any>;
    getHistory(req: any): Promise<{
        success: boolean;
        count: number;
        data: {
            id: number;
            filename: string;
            fullName: any;
            createdAt: Date;
        }[];
    }>;
    mapToProfile(req: any, cvBuilderId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            fullName: string | null;
            phone: string | null;
            address: string | null;
            jobTitle: string | null;
            experienceYear: string | null;
            careerLevel: string | null;
        };
    }>;
    mapFromLocalCV(req: any, body: MapFromLocalCvDto): Promise<{
        success: boolean;
        message: string;
        data: {
            fullName: string | null;
            phone: string | null;
            address: string | null;
            jobTitle: string | null;
            experienceYear: string | null;
            careerLevel: string | null;
        };
    }>;
    getCVDetail(req: any, id: string): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            result: import("@prisma/client/runtime/library").JsonValue;
            userID: number;
            id: number;
            updatedAt: Date;
            fileHash: string;
            filename: string;
        };
    }>;
}
