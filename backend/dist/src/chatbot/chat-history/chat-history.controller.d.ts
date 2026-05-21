import { ChatHistoryService } from "./chat-history.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { SaveMessageDto } from "./dto/save-message.dto";
import { RenameSessionDto } from './dto/rename-session.dto';
import { PinSessionDto } from './dto/pin-session.dto';
export declare class ChatHistoryController {
    private chatHistoryService;
    constructor(chatHistoryService: ChatHistoryService);
    getSessions(req: any): Promise<{
        createdAt: Date;
        userID: number;
        id: number;
        updatedAt: Date;
        title: string;
        isPinned: boolean;
    }[]>;
    createSession(req: any, dto: CreateSessionDto): Promise<{
        createdAt: Date;
        userID: number;
        id: number;
        updatedAt: Date;
        title: string;
        isPinned: boolean;
    }>;
    getMessages(sessionID: number): Promise<{
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
    renameSession(sessionID: number, dto: RenameSessionDto, req: any): Promise<{
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
    pinSession(sessionID: number, dto: PinSessionDto, req: any): Promise<{
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
