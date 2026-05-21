import { MailService } from '../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from "../notification/notification.service";
export declare class JobAlertService {
    private prisma;
    private mail;
    private notificationService;
    constructor(prisma: PrismaService, mail: MailService, notificationService: NotificationService);
    createAlert(accountID: number, keyword: string): Promise<{
        message: string;
    }>;
    unsubscribe(accountID: number, keyword: string): Promise<{
        message: string;
    }>;
    getAlertsByAccount(accountID: number): Promise<{
        createdAt: Date;
        keyword: string;
    }[]>;
    sendDailyAlerts(): Promise<void>;
}
