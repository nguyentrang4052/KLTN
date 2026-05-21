export declare class CreateSubscriptionDto {
    planName: string;
    billing: 'monthly' | 'yearly';
    paymentMethod?: string;
}
export declare class CancelSubscriptionDto {
    reason: string;
}
export declare class ConfirmPaymentDto {
    transactionRef: string;
    result: 'success' | 'failed';
}
export declare class RefundDto {
    reason: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
}
