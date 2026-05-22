import { PrismaService } from '../../prisma/prisma.service';
import { NotificationGateway } from '../websocket-gateway/notification.gateway';
import { CreateNotificationDto } from '../dto/notification.dto';
export declare class NotificationService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: NotificationGateway);
    create(dto: CreateNotificationDto): Promise<{
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
    }>;
    getByUser(userID: number, onlyUnread?: boolean): Promise<{
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
    countUnread(userID: number): Promise<number>;
    markAsRead(userID: number, id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userID: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteOne(userID: number, id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createIfNotExists(dto: CreateNotificationDto & {
        dedupeKey: string;
    }): Promise<{
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
    } | null>;
    getEmailPref(accountID: number): Promise<{
        emailNotification: boolean;
    }>;
    updateEmailPref(accountID: number, emailNotification: boolean): Promise<{
        emailNotification: boolean;
    }>;
}
