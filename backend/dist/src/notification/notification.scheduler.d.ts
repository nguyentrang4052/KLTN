import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationService } from './notification.service';
export declare class NotificationScheduler {
    private prisma;
    private mailService;
    private notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService, notificationService: NotificationService);
    sendSubscriptionExpiryReminders(): Promise<void>;
    sendSavedJobDeadlineReminders(): Promise<void>;
}
