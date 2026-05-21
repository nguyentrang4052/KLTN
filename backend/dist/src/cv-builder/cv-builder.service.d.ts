import { PrismaService } from '../../prisma/prisma.service';
export declare class CvBuilderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getByUser(userID: number): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    }[]>;
    getById(id: number, userID: number): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    } | null>;
    create(userID: number, body: any): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    }>;
    update(id: number, userID: number, body: any): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    } | null>;
    delete(id: number, userID: number): Promise<boolean>;
}
