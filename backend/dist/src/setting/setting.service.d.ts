import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingService {
    private prisma;
    constructor(prisma: PrismaService);
    changePassword(accountID: number, dto: any): Promise<{
        message: string;
    }>;
}
