import { PrismaService } from "../../../prisma/prisma.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { SaveMessageDto } from "./dto/save-message.dto";
export declare class ChatHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    findSessionByUser(userID: number): Promise<{
        createdAt: Date;
        userID: number;
        id: number;
        updatedAt: Date;
        title: string;
        isPinned: boolean;
    }[]>;
    createSession(dto: CreateSessionDto & {
        userID: number;
    }): Promise<{
        createdAt: Date;
        userID: number;
        id: number;
        updatedAt: Date;
        title: string;
        isPinned: boolean;
    }>;
    findMessagesBySession(sessionID: number): Promise<{
        createdAt: Date;
        role: string;
        id: number;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string | null;
        sessionID: number;
    }[]>;
    saveMessage(dto: SaveMessageDto): Promise<{
        createdAt: Date;
        role: string;
        id: number;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string | null;
        sessionID: number;
    }>;
    deleteSession(sessionID: number): Promise<{
        success: boolean;
    }>;
    renameSession(sessionID: number, newTitle: string, userID: number): Promise<{
        success: boolean;
        session: {
            createdAt: Date;
            userID: number;
            id: number;
            updatedAt: Date;
            title: string;
            isPinned: boolean;
        };
    }>;
    pinSession(sessionID: number, isPinned: boolean, userID: number): Promise<{
        success: boolean;
        session: {
            createdAt: Date;
            userID: number;
            id: number;
            updatedAt: Date;
            title: string;
            isPinned: boolean;
        };
    }>;
}
