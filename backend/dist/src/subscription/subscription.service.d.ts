import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { CreateSubscriptionDto, ConfirmPaymentDto, RefundDto } from '../dto/subscription.dto';
import { NotificationService } from "../notification/notification.service";
export declare class SubscriptionService {
    private prisma;
    private config;
    private mailService;
    private notificationService;
    private payos;
    constructor(prisma: PrismaService, config: ConfigService, mailService: MailService, notificationService: NotificationService);
    private currentMonth;
    private grantQuota;
    private revokeQuota;
    getUserQuota(accountID: number): Promise<{
        jobSuggestPerDay: number;
        jobSuggestUsedToday: number;
        cvAnalysisTotal: number;
        cvAnalysisUsed: number;
        cvAnalysisRemaining: number;
        cvMatchCheckTotal: number;
        cvMatchCheckUsed: number;
        cvMatchCheckRemaining: number;
        subExpired: boolean;
        expiresAt?: undefined;
    } | {
        jobSuggestPerDay: number;
        jobSuggestUsedToday: number;
        cvAnalysisTotal: number;
        cvAnalysisUsed: number;
        cvAnalysisRemaining: number;
        cvMatchCheckTotal: number;
        cvMatchCheckUsed: number;
        cvMatchCheckRemaining: number;
        subExpired: boolean;
        expiresAt: Date | null;
    }>;
    checkAndConsumeQuota(accountID: number, feature: 'cvAnalysis' | 'cvMatchCheck'): Promise<{
        success: boolean;
        feature: "cvAnalysis" | "cvMatchCheck";
    }>;
    subscribe(accountID: number, dto: CreateSubscriptionDto): Promise<{
        subscription: {
            id: number;
            planName: string;
            displayName: string;
            billing: string;
            status: string;
        };
        payment: {
            id: number;
            amount: number;
            transactionRef: string | null;
            status: string;
            checkoutUrl: any;
            qrCode: any;
        };
    }>;
    confirmPayment(dto: ConfirmPaymentDto): Promise<{
        success: boolean;
        status: any;
        message: string;
    }>;
    requestRefund(accountID: number, dto: RefundDto): Promise<{
        success: boolean;
        message: string;
        amount: number;
    }>;
    cancelSubscription(accountID: number): Promise<{
        message: string;
        expiresAt: Date;
    }>;
    getCurrentSubscription(accountID: number): Promise<{
        planName: string;
        displayName: string;
        billing: null;
        status: string;
        expiresAt: null;
        autoRenew: boolean;
        plan: ({
            limits: {
                id: number;
                jobSuggestPerDay: number;
                planID: number;
                cvAnalysisPerMonth: number;
                cvMatchCheckCount: number;
            } | null;
        } & {
            name: string;
            createdAt: Date;
            id: number;
            displayName: string;
            monthlyPrice: number;
            yearlyPrice: number;
        }) | null;
        subscriptionID?: undefined;
        startedAt?: undefined;
        paidAt?: undefined;
    } | {
        subscriptionID: number;
        planName: string;
        displayName: string;
        billing: string;
        status: string;
        startedAt: Date;
        expiresAt: Date;
        autoRenew: boolean;
        plan: {
            name: string;
            createdAt: Date;
            id: number;
            displayName: string;
            monthlyPrice: number;
            yearlyPrice: number;
        };
        paidAt: Date | null;
    }>;
    getPaymentHistory(accountID: number): Promise<{
        id: number;
        planName: string;
        billing: string;
        amount: number;
        method: string | null;
        status: string;
        transactionRef: string | null;
        paidAt: Date | null;
        createdAt: Date;
    }[]>;
    getAllPlans(): Promise<({
        limits: {
            id: number;
            jobSuggestPerDay: number;
            planID: number;
            cvAnalysisPerMonth: number;
            cvMatchCheckCount: number;
        } | null;
    } & {
        name: string;
        createdAt: Date;
        id: number;
        displayName: string;
        monthlyPrice: number;
        yearlyPrice: number;
    })[]>;
    seedPlans(): Promise<void>;
    private getActiveQuota;
    private getFreePlanLimits;
}
