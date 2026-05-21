import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
export interface ChatResult {
    response?: string;
    content?: string;
    type: 'text' | 'stream' | 'error' | 'job_list' | 'cv_analysis_complete';
    cached?: boolean;
    analysis?: any;
    job_matches?: any[];
    jobs?: any[];
    error?: boolean;
    success?: boolean;
    data?: Readable;
}
export declare class ChatbotService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly pythonServiceUrl;
    private readonly internalApiKey;
    private readonly CV_UPLOAD_TIMEOUT;
    private readonly CHAT_TIMEOUT;
    private readonly HEALTH_TIMEOUT;
    constructor(httpService: HttpService, configService: ConfigService);
    uploadCV(userID: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: any;
        analysis: any;
        job_matches: any;
        type: any;
        cached: any;
        error: any;
        isTimeout?: undefined;
        details?: undefined;
        isConnectionError?: undefined;
    } | {
        success: boolean;
        message: string;
        error: boolean;
        isTimeout: boolean;
        details: string;
        analysis?: undefined;
        job_matches?: undefined;
        type?: undefined;
        cached?: undefined;
        isConnectionError?: undefined;
    } | {
        success: boolean;
        message: string;
        error: boolean;
        isTimeout: boolean;
        analysis?: undefined;
        job_matches?: undefined;
        type?: undefined;
        cached?: undefined;
        details?: undefined;
        isConnectionError?: undefined;
    } | {
        success: boolean;
        message: string;
        error: boolean;
        isConnectionError: boolean;
        analysis?: undefined;
        job_matches?: undefined;
        type?: undefined;
        cached?: undefined;
        isTimeout?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        message: string;
        error: boolean;
        details: any;
        analysis?: undefined;
        job_matches?: undefined;
        type?: undefined;
        cached?: undefined;
        isTimeout?: undefined;
        isConnectionError?: undefined;
    }>;
    chat(userId: string, message: string, stream?: boolean): Promise<ChatResult>;
    healthCheck(): Promise<{
        status: string;
        pythonService: any;
        timestamp: string;
    }>;
}
