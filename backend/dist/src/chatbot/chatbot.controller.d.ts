import { ChatbotService } from './chatbot.service';
import { SubscriptionService } from '../subscription/subscription.service';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import type { Response } from 'express';
export declare class ChatbotController {
    private readonly chatbotService;
    private readonly subscriptionService;
    private readonly logger;
    constructor(chatbotService: ChatbotService, subscriptionService: SubscriptionService);
    chat(body: any, file: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    uploadCV(file: Express.Multer.File, body: any, user: JwtUser, res: Response): Promise<Response<any, Record<string, any>>>;
    health(res: Response): Promise<Response<any, Record<string, any>>>;
}
