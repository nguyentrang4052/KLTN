import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private transporter;
    constructor(config: ConfigService);
    sendOtp(email: string, otp: string): Promise<void>;
    sendAlertConfirmation(email: string, keyword: string): Promise<void>;
    sendJobAlert(email: string, keyword: string, jobs: any[]): Promise<void>;
    sendPaymentInvoice(email: string, data: {
        fullName?: string;
        planDisplayName: string;
        billing: string;
        amount: number;
        transactionRef: string;
        paidAt: Date;
        expiresAt: Date;
    }): Promise<void>;
    sendSubscriptionExpiringSoon(email: string, data: {
        fullName?: string;
        planDisplayName: string;
        billing: string;
        expiresAt: Date;
        daysLeft: number;
    }): Promise<void>;
    sendSavedJobDeadlineAlert(email: string, data: {
        fullName?: string;
        jobs: Array<{
            jobID: number;
            title: string;
            companyName: string;
            deadline: Date;
            hoursLeft: number;
            sourceLink?: string;
        }>;
    }): Promise<void>;
}
