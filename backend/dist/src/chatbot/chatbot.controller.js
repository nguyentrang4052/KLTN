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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatbotController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const chatbot_service_1 = require("./chatbot.service");
const subscription_service_1 = require("../subscription/subscription.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const stream_1 = require("stream");
let ChatbotController = ChatbotController_1 = class ChatbotController {
    chatbotService;
    subscriptionService;
    logger = new common_1.Logger(ChatbotController_1.name);
    constructor(chatbotService, subscriptionService) {
        this.chatbotService = chatbotService;
        this.subscriptionService = subscriptionService;
    }
    async chat(body, file, res) {
        const userID = body.userID;
        const message = body.message;
        const stream = body.stream;
        if (!userID || !message) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Missing userID or message',
                error: true,
            });
        }
        const isStream = stream === 'true' || stream === true;
        const result = await this.chatbotService.chat(String(userID), message, isStream);
        if (result.type === 'stream' && result.data instanceof stream_1.Readable) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            return result.data.pipe(res);
        }
        return res.status(common_1.HttpStatus.OK).json({
            ...result,
            success: !result.error,
        });
    }
    async uploadCV(file, body, user, res) {
        const userID = body.userID;
        this.logger.log(`📥 UploadCV Controller: userID=${userID}, hasFile=${!!file}, fileSize=${file?.size}`);
        if (!file) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'No file uploaded',
                error: true,
            });
        }
        if (!userID) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Missing userID in body',
                error: true,
            });
        }
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Invalid file type. Only PDF and DOCX allowed',
                error: true,
            });
        }
        if (file.size > 10 * 1024 * 1024) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'File too large. Max 10MB',
                error: true,
            });
        }
        try {
            await this.subscriptionService.checkAndConsumeQuota(user.sub, 'cvAnalysis');
        }
        catch (err) {
            return res.status(common_1.HttpStatus.PAYMENT_REQUIRED).json({
                success: false,
                message: err.message,
                error: true,
                quotaExceeded: true,
            });
        }
        const result = await this.chatbotService.uploadCV(userID, file);
        const statusCode = result.success
            ? common_1.HttpStatus.OK
            : result.isTimeout
                ? common_1.HttpStatus.GATEWAY_TIMEOUT
                : result.isConnectionError
                    ? common_1.HttpStatus.SERVICE_UNAVAILABLE
                    : common_1.HttpStatus.BAD_GATEWAY;
        return res.status(statusCode).json(result);
    }
    async health(res) {
        const result = await this.chatbotService.healthCheck();
        const statusCode = result.status === 'ok' ? common_1.HttpStatus.OK : common_1.HttpStatus.SERVICE_UNAVAILABLE;
        return res.status(statusCode).json(result);
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('upload-cv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "uploadCV", null);
__decorate([
    (0, common_1.Get)('health'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "health", null);
exports.ChatbotController = ChatbotController = ChatbotController_1 = __decorate([
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService,
        subscription_service_1.SubscriptionService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map