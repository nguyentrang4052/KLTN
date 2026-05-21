export type NotificationType = 'subscription_expiry' | 'job_deadline' | 'job_alert' | 'payment_success';
export declare class GetNotificationsDto {
    unread?: boolean;
    take?: number;
}
export declare class CreateNotificationDto {
    userID: number;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, any>;
}
