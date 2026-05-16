import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import FormData from 'form-data';
import { AxiosError } from 'axios';
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
    data?: Readable; // ← stream data
}


@Injectable()
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);
    private readonly pythonServiceUrl: string;
    private readonly internalApiKey: string;

    // Tăng timeout CV lên 10 phút
    private readonly CV_UPLOAD_TIMEOUT = 600_000; // 10 phút
    private readonly CHAT_TIMEOUT = 30_000;        // 3 phút
    private readonly HEALTH_TIMEOUT = 10_000;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.pythonServiceUrl = this.configService.get<string>(
            'PYTHON_SERVICE_URL',
            'http://localhost:8000',
        );
        this.internalApiKey = this.configService.get<string>(
            'INTERNAL_API_KEY',
            'chatbot_RecruitmentWEB_secure_key',
        );
    }

    async uploadCV(userID: string, file: Express.Multer.File) {
        const formData = new FormData();
        formData.append('userID', userID);
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        this.logger.log(`📤 UploadCV: userID=${userID}, fileSize=${file.size}, timeout=${this.CV_UPLOAD_TIMEOUT}ms`);

        const startTime = Date.now();

        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.pythonServiceUrl}/api/upload-cv`,
                    formData,
                    {
                        headers: {
                            ...formData.getHeaders(),
                            'X-Internal-Key': this.internalApiKey,
                        },
                        timeout: this.CV_UPLOAD_TIMEOUT,
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                    },
                ).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(`Axios error: ${error.code}, message: ${error.message}`);
                        if (error.response) {
                            this.logger.error(`Response status: ${error.response.status}`);
                            this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
                        }
                        throw error;
                    })
                ),
            );

            const duration = Date.now() - startTime;
            this.logger.log(`✅ Python response in ${duration}ms: ${JSON.stringify(response.data).substring(0, 200)}`);

            const pythonData = response.data;

            if (!pythonData || typeof pythonData !== 'object') {
                throw new Error('Invalid response structure from Python service');
            }

            return {
                success: pythonData.success !== false,
                message: pythonData.message || 'CV đã được phân tích',
                analysis: pythonData.analysis || null,
                job_matches: pythonData.job_matches || [],
                type: pythonData.type || 'cv_analysis_complete',
                cached: pythonData.cached || false,
                error: pythonData.error || false,
            };

        } catch (error: any) {
            const duration = Date.now() - startTime;
            this.logger.error(`❌ UploadCV failed after ${duration}ms: ${error.message}, code=${error.code}`);

            // Phân biệt rõ các loại lỗi
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    message: `Kết nối bị hủy sau ${duration}ms. Python service có thể đang xử lý chậm hoặc không phản hồi.`,
                    error: true,
                    isTimeout: true,
                    details: `Request aborted after ${duration}ms`
                };
            }

            if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
                return {
                    success: false,
                    message: `Timeout sau ${duration}ms. Vui lòng thử lại.`,
                    error: true,
                    isTimeout: true,
                };
            }

            if (error.code === 'ECONNREFUSED') {
                return {
                    success: false,
                    message: 'Không thể kết nối đến Python service (port 8000). Vui lòng kiểm tra service đã chạy chưa.',
                    error: true,
                    isConnectionError: true,
                };
            }

            return {
                success: false,
                message: `Lỗi: ${error.message}`,
                error: true,
                details: error.response?.data || error.message,
            };
        }
    }

    async chat(userId: string, message: string, stream: boolean = false): Promise<ChatResult> {
        const params = new URLSearchParams();
        params.append('user_id', userId);
        params.append('message', message);
        params.append('stream', stream.toString());

        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.pythonServiceUrl}/api/chat`, params.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Internal-Key': this.internalApiKey,
                    },
                    responseType: stream ? 'stream' : 'json',
                    timeout: this.CHAT_TIMEOUT,
                    validateStatus: () => true,
                }),
            );

            if (stream) {
                return {
                    type: 'stream',
                    data: response.data as Readable,
                    cached: false,
                    success: true,
                };
            }

            const pythonData = response.data;

            if (pythonData.error === true || pythonData.success === false) {
                const errMsg = pythonData.message || pythonData.detail || 'Lỗi từ Python';
                return {
                    type: 'error',
                    response: `❌ ${errMsg}`,
                    error: true,
                    success: false,
                };
            }

            // 🔥 QUAN TRỌNG: Kiểm tra type từ Python và chuyển tiếp đầy đủ dữ liệu
            if(pythonData.type === 'job_list') {
                return {
                    type: 'job_list',
                    content: pythonData.content ?? '',
                    jobs: pythonData.jobs ?? [],
                    cached: pythonData.cached || false,
                    success: true,
                };
            }

            // Xử lý cv_analysis_complete
            if (pythonData.type === 'cv_analysis_complete') {
                return {
                    type: 'cv_analysis_complete',
                    response: pythonData.message || pythonData.content || '',
                    analysis: pythonData.analysis,
                    job_matches: pythonData.job_matches || [],
                    cached: pythonData.cached || false,
                    success: true,
                };
            }

            // Fallback cho text thông thường
            return {
                type: pythonData.type === 'error' ? 'error' : 'text',
                response: pythonData?.response || pythonData?.message || pythonData?.content || '',
                cached: pythonData?.cached || false,
                analysis: pythonData?.data?.analysis || pythonData?.analysis,
                job_matches: pythonData?.data?.job_matches || pythonData?.job_matches,
                success: true,
            };

        } catch (error: any) {
            this.logger.error(`Chat error: ${error?.message}`);

            if (error instanceof AxiosError && error.response) {
                const axiosMsg =
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    error.message ||
                    'Kết nối đến AI service thất bại';
                return {
                    type: 'error',
                    response: `❌ ${axiosMsg}`,
                    error: true,
                    success: false,
                };
            }

            return {
                type: 'error',
                response: `❌ ${error?.message || 'Lỗi không xác định'}`,
                error: true,
                success: false,
            };
        }
    }

    async healthCheck() {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.pythonServiceUrl}/api/health`, {
                    timeout: this.HEALTH_TIMEOUT,
                }),
            );
            return {
                status: 'ok',
                pythonService: response.data,
                timestamp: new Date().toISOString(),
            };
        } catch (error: any) {
            this.logger.error(`Health check failed: ${error.message}`);
            return {
                status: 'degraded',
                pythonService: { status: 'down', error: error.message },
                timestamp: new Date().toISOString(),
            };
        }
    }
}