import { CvBuilderService } from './cv-builder.service';
export declare class CvBuilderController {
    private readonly cvBuilderService;
    constructor(cvBuilderService: CvBuilderService);
    getMyCVs(req: any): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    }[]>;
    getDetail(req: any, id: number): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    }>;
    create(req: any, body: any): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    }>;
    update(req: any, id: number, body: any): Promise<{
        name: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userID: number;
        id: number;
        updatedAt: Date;
        templateId: string;
    }>;
    delete(req: any, id: number): Promise<{
        success: boolean;
    }>;
}
