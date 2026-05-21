import { ConfigService } from '@nestjs/config';
export declare class GeminiService {
    private readonly configService;
    private readonly logger;
    private readonly genAI;
    private readonly model;
    constructor(configService: ConfigService);
    private hasVietnameseDiacritics;
    private detectCvLanguage;
    private removeVietnameseDiacritics;
    private removeDiacriticsFromNames;
    analyzeCV(cvText: string, retryCount?: number): Promise<any>;
    private analyzeCVSimple;
    analyzeCVWithVerification(cvText: string): Promise<any>;
    extractTextFromImage(imageInput: string | Buffer, retryCount?: number): Promise<string>;
    private delay;
    private extractFirstJsonObject;
    private extractJsonFromResponse;
    private manualJsonFix;
    translateCV(cvData: any, targetLang: 'en' | 'vi', sectionTitles?: Record<string, string>): Promise<{
        cvData: any;
        sectionTitles?: Record<string, string>;
    }>;
    private removeAvatarField;
    private restoreAvatarField;
    private mergeMissingFields;
    suggestCVImprovements(cvData: any, userPrompt: string, section?: string): Promise<any>;
    private generateContent;
    scoreJobs(prompt: string): Promise<any>;
}
