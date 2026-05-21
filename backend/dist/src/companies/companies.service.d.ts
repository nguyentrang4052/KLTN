import { PrismaService } from '../../prisma/prisma.service';
import { QueryCompaniesDto } from '../dto/companies.dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    private getCompanyIDsBySize;
    getCompanies(dto: QueryCompaniesDto): Promise<{
        data: {
            companyID: number;
            name: string;
            logo: string | null;
            location: string | null;
            size: string | null;
            jobCount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTopCompanies(limit?: number): Promise<{
        companyID: number;
        name: string;
        logo: string | null;
        jobCount: number;
    }[]>;
    getLocations(): Promise<{
        value: string | null;
        count: number;
    }[]>;
    getSizes(): Promise<{
        value: string | null;
        count: number;
    }[]>;
    getCompanyById(companyID: number): Promise<{
        companyID: number;
        name: string;
        logo: string | null;
        website: string | null;
        profile: string | null;
        location: string | null;
        size: string | null;
        jobCount: number;
        jobs: {
            jobID: number;
            title: string | null;
            jobType: string | null;
            salary: string | null;
            experienceYear: string | null;
            deadline: Date | null;
            postedAt: Date | null;
            skills: string[];
        }[];
    } | null>;
    getCompanySuggestions(q: string): Promise<{
        name: string;
        logo: string | null;
    }[]>;
    saveCompanySearchHistory(accountID: number, keyword: string): Promise<void>;
    getCompanySearchHistory(accountID: number): Promise<string[]>;
}
