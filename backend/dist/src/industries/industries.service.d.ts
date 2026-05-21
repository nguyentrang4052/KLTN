import { PrismaService } from '../../prisma/prisma.service';
import { QueryIndustriesDto } from '../dto/industries.dto';
export declare class IndustriesService {
    private prisma;
    constructor(prisma: PrismaService);
    getIndustries(dto: QueryIndustriesDto): Promise<{
        name: string;
        id: number;
    }[]>;
    getIndustriesWithCount(): Promise<{
        id: number;
        name: string;
        jobCount: number;
        trend: string;
    }[]>;
}
