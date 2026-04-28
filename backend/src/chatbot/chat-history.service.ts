import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSessionDto } from "../dto/create-session.dto";
import { SaveMessageDto } from "src/dto/save-message.dto";

@Injectable()
export class ChatHistoryService {
    constructor(private prisma: PrismaService) { }

    async findSessionByUser(userID: number) {
        const sessions = await this.prisma.chatSession.findMany({
            where: { userID },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                userID: true,
                title: true,
                createdAt: true,
                updatedAt: true,

            }
        });
        return sessions;
    }

    async createSession(dto: CreateSessionDto & { userID: number }) {
        const session = await this.prisma.chatSession.create({
            data: {
                userID: dto.userID,
                title: dto.title?.trim() || "New Chat",
            },
        });
        return session;
    }

    async findMessagesBySession(sessionID: number) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: sessionID },
        });
        if (!session) {
            throw new NotFoundException(`Session ${sessionID} not found`);
        }

        const messages = await this.prisma.chatMessage.findMany({
            where: { sessionID },
            orderBy: { createdAt: "asc" },
        });
        return messages;

    }

    async saveMessage(dto: SaveMessageDto) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: dto.sessionID },
        });
        if (!session) {
            throw new NotFoundException(`Session ${dto.sessionID} not found`);
        }

        const [message] = await this.prisma.$transaction([
            this.prisma.chatMessage.create({
                data: {
                    sessionID: dto.sessionID,
                    role: dto.role,
                    content: dto.content,
                    type: dto.type,
                    metadata: dto.metadata,
                },
            }),
            this.prisma.chatSession.update({
                where: { id: dto.sessionID },
                data: {},
            }),
        ]);
        return message;
    }

    async deleteSession(sessionID: number) {
        try {
            await this.prisma.chatSession.delete({
                where: { id: sessionID },
            });
            return { success: true };
        } catch (error) {
            throw new NotFoundException(`Session ${sessionID} not found`);
        }
    }
}
