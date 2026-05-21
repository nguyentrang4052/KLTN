import { SubscriptionService } from './subscription.service';
import { ConfirmPaymentDto, CreateSubscriptionDto, RefundDto } from '../dto/subscription.dto';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getPlans(): Promise<({
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
    seed(): Promise<void>;
    getCurrent(user: JwtUser): Promise<{
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
    getHistory(user: JwtUser): Promise<{
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
    subscribe(user: JwtUser, dto: CreateSubscriptionDto): Promise<{
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
    requestRefund(user: JwtUser, dto: RefundDto): Promise<{
        success: boolean;
        message: string;
        amount: number;
    }>;
    cancel(user: JwtUser): Promise<{
        message: string;
        expiresAt: Date;
    }>;
    getQuota(user: JwtUser): Promise<{
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
    consumeQuota(user: JwtUser, feature: 'cvAnalysis' | 'cvMatchCheck'): Promise<{
        success: boolean;
        feature: "cvAnalysis" | "cvMatchCheck";
    }>;
}
