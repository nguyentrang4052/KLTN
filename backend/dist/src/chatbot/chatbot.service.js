"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ChatbotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const form_data_1 = __importDefault(require("form-data"));
const axios_2 = require("axios");
let ChatbotService = ChatbotService_1 = class ChatbotService {
    httpService;
    configService;
    logger = new common_1.Logger(ChatbotService_1.name);
    pythonServiceUrl;
    internalApiKey;
    CV_UPLOAD_TIMEOUT = 600_000;
    CHAT_TIMEOUT = 30_000;
    HEALTH_TIMEOUT = 10_000;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.pythonServiceUrl = this.configService.get('PYTHON_SERVICE_URL', 'http://localhost:8000');
        this.internalApiKey = this.configService.get('INTERNAL_API_KEY', 'chatbot_RecruitmentWEB_secure_key');
    }
    async uploadCV(userID, file) {
        const formData = new form_data_1.default();
        formData.append('userID', userID);
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        this.logger.log(`📤 UploadCV: userID=${userID}, fileSize=${file.size}, timeout=${this.CV_UPLOAD_TIMEOUT}ms`);
        const startTime = Date.now();
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.pythonServiceUrl}/api/upload-cv`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'X-Internal-Key': this.internalApiKey,
                },
                timeout: this.CV_UPLOAD_TIMEOUT,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Axios error: ${error.code}, message: ${error.message}`);
                if (error.response) {
                    this.logger.error(`Response status: ${error.response.status}`);
                    this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
                }
                throw error;
            })));
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
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`❌ UploadCV failed after ${duration}ms: ${error.message}, code=${error.code}`);
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
    async chat(userId, message, stream = false) {
        const params = new URLSearchParams();
        params.append('user_id', userId);
        params.append('message', message);
        params.append('stream', stream.toString());
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.pythonServiceUrl}/api/chat`, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Internal-Key': this.internalApiKey,
                },
                responseType: stream ? 'stream' : 'json',
                timeout: this.CHAT_TIMEOUT,
                validateStatus: () => true,
            }));
            if (stream) {
                return {
                    type: 'stream',
                    data: response.data,
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
            if (pythonData.type === 'job_list') {
                return {
                    type: 'job_list',
                    content: pythonData.content ?? '',
                    jobs: pythonData.jobs ?? [],
                    cached: pythonData.cached || false,
                    success: true,
                };
            }
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
            return {
                type: pythonData.type === 'error' ? 'error' : 'text',
                response: pythonData?.response || pythonData?.message || pythonData?.content || '',
                cached: pythonData?.cached || false,
                analysis: pythonData?.data?.analysis || pythonData?.analysis,
                job_matches: pythonData?.data?.job_matches || pythonData?.job_matches,
                success: true,
            };
        }
        catch (error) {
            this.logger.error(`Chat error: ${error?.message}`);
            if (error instanceof axios_2.AxiosError && error.response) {
                const axiosMsg = error.response.data?.detail ||
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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.pythonServiceUrl}/api/health`, {
                timeout: this.HEALTH_TIMEOUT,
            }));
            return {
                status: 'ok',
                pythonService: response.data,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Health check failed: ${error.message}`);
            return {
                status: 'degraded',
                pythonService: { status: 'down', error: error.message },
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = ChatbotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map