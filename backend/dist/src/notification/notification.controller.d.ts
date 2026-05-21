import { NotificationService } from './notification.service';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
export declare class NotificationController {
    private notificationService;
    private prisma;
    constructor(notificationService: NotificationService, prisma: PrismaService);
    private resolveUserID;
    getEmailPref(auth: JwtUser): Promise<{
        emailNotification: boolean;
    }>;
    updateEmailPref(auth: JwtUser, body: {
        emailNotification: boolean;
    }): Promise<{
        emailNotification: boolean;
    }>;
    getAll(auth: JwtUser, unread?: string): Promise<{
        createdAt: Date;
        userID: number;
        id: number;
        title: string;
        type: string;
        body: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        readAt: Date | null;
        dedupeKey: string | null;
        deletedAt: Date | null;
    }[]>;
    unreadCount(auth: JwtUser): Promise<{
        count: number;
    }>;
    markRead(auth: JwtUser, id: number): Promise<{
        success: boolean;
    }>;
    markAllRead(auth: JwtUser): Promise<{
        success: boolean;
    }>;
    deleteOne(auth: JwtUser, id: number): Promise<{
        success: boolean;
    }>;
}
