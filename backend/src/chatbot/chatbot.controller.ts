import {
    Controller,
    Post,
    Get,
    Body,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Res,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatbotService } from './chatbot.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import type { Response } from 'express';
import { Readable } from 'stream';

@Controller('chatbot')
export class ChatbotController {
    private readonly logger = new Logger(ChatbotController.name);

    constructor(
        private readonly chatbotService: ChatbotService,
        private readonly subscriptionService: SubscriptionService,
    ) { }

    @Post('chat')
    @UseInterceptors(FileInterceptor('file'))
    async chat(
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
    ) {
        const userID = body.userID;
        const message = body.message;
        const stream = body.stream;

        if (!userID || !message) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Missing userID or message',
                error: true,
            });
        }

        const isStream = stream === 'true' || stream === true;
        const result = await this.chatbotService.chat(String(userID), message, isStream);

        if (result.type === 'stream' && result.data instanceof Readable) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            return result.data.pipe(res);
        }

        return res.status(HttpStatus.OK).json({
            ...result,
            success: !result.error,
        });
    }

    @Post('upload-cv')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadCV(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @GetUser() user: JwtUser,
        @Res() res: Response,
    ) {
        const userID = body.userID;

        this.logger.log(`📥 UploadCV Controller: userID=${userID}, hasFile=${!!file}, fileSize=${file?.size}`);

        if (!file) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'No file uploaded',
                error: true,
            });
        }

        if (!userID) {
            return res.status(HttpStatus.BAD_REQUEST).json({
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Invalid file type. Only PDF and DOCX allowed',
                error: true,
            });
        }

        if (file.size > 10 * 1024 * 1024) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'File too large. Max 10MB',
                error: true,
            });
        }

        try {
            await this.subscriptionService.checkAndConsumeQuota(user.sub, 'cvAnalysis');
        } catch (err) {
            return res.status(HttpStatus.PAYMENT_REQUIRED).json({
                success: false,
                message: err.message,
                error: true,
                quotaExceeded: true,
            });
        }

        const result = await this.chatbotService.uploadCV(userID, file);

        const statusCode = result.success
            ? HttpStatus.OK
            : result.isTimeout
                ? HttpStatus.GATEWAY_TIMEOUT
                : result.isConnectionError
                    ? HttpStatus.SERVICE_UNAVAILABLE
                    : HttpStatus.BAD_GATEWAY;

        return res.status(statusCode).json(result);
    }

    @Get('health')
    async health(@Res() res: Response) {
        const result = await this.chatbotService.healthCheck();
        const statusCode = result.status === 'ok' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        return res.status(statusCode).json(result);
    }
}