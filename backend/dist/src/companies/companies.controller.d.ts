import { Request } from 'express';
import { CompaniesService } from './companies.service';
import { QueryCompaniesDto } from '../dto/companies.dto';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
interface RequestWithUser extends Request {
    user?: JwtUser;
}
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
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
    getTopCompanies(): Promise<{
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
    getSuggestions(q: string): Promise<{
        name: string;
        logo: string | null;
    }[]>;
    saveSearchHistory(keyword: string, req: RequestWithUser): Promise<void>;
    getSearchHistory(user: JwtUser): Promise<string[]>;
    getCompanyById(id: number): Promise<{
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
}
export {};
