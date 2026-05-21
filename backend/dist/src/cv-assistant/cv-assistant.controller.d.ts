import { GeminiService } from '../gemini/gemini.service';
import { TranslateCVDto } from './dto/translate-cv.dto';
import { SuggestCVDto } from './dto/suggest-cv.dto';
export declare class CvAssistantController {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    translateCV(dto: TranslateCVDto): Promise<{
        success: boolean;
        data: {
            cvData: any;
            sectionTitles?: Record<string, string>;
        };
    }>;
    suggestImprovements(dto: SuggestCVDto, req: any): Promise<{
        success: boolean;
        data: any;
    }>;
}
