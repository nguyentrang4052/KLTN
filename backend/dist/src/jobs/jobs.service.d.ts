import { PrismaService } from '../../prisma/prisma.service';
import { QueryJobsDto } from '../dto/jobs.dto';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    getJobs(dto: QueryJobsDto, accountID?: number): Promise<{
        data: {
            jobID: number;
            title: string | null;
            companyID: number;
            companyName: string;
            companyLogo: string | null;
            location: string | null;
            shortLocation: string | null;
            experienceYear: string | null;
            salary: string | null;
            jobType: string | null;
            sourcePlatform: string | null;
            sourceLink: string | null;
            postedAt: Date | null;
            deadline: Date | null;
            industry: string | undefined;
            skills: string[];
            matchPercent: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getJobById(jobID: number): Promise<{
        industry: string | undefined;
        skills: string[];
        company: {
            address: string | null;
            companyID: number;
            companyName: string;
            companyWebsite: string | null;
            companyProfile: string | null;
            companySize: string | null;
            companyLogo: string | null;
        };
        experienceYear: string | null;
        industryID: number | null;
        salary: string | null;
        deadline: Date | null;
        jobType: string | null;
        companyID: number;
        description: string | null;
        title: string | null;
        jobID: number;
        location: string | null;
        requirement: string | null;
        benefit: string | null;
        workingTime: string | null;
        postedAt: Date | null;
        sourcePlatform: string | null;
        sourceLink: string | null;
        isActive: boolean;
        other: string | null;
        shortLocation: string | null;
        isNewJob: boolean;
        discoveredAt: Date | null;
    } | null>;
    computeAndSaveRecommendations(accountID: number): Promise<void>;
    getRecommendations(accountID: number, wasRecomputed?: boolean): Promise<{
        data: never[];
        quota: null;
    } | {
        data: {
            jobID: number;
            title: string | null;
            companyID: number;
            companyName: string;
            companyLogo: string | null;
            location: string | null;
            shortLocation: string | null;
            experienceYear: string | null;
            salary: string | null;
            skills: string[];
            matchPercent: number;
            matchReason: string | null;
            sourcePlatform: string | null;
        }[];
        quota: {
            limit: number | null;
            usedToday: number | null;
            remaining: number | null;
            isUnlimited: boolean;
            quotaExceeded: boolean;
            resetAt: string;
        };
    }>;
    logUserBehavior(accountID: number, jobID: number, action: string): Promise<void>;
    incrementRecommendationQuota(accountID: number): Promise<void>;
    getUserStats(accountID: number): Promise<{
        jobMatch: {
            count: number;
            delta: string;
            label: string;
        };
    } | null>;
    saveJob(accountID: number, jobID: number): Promise<{
        userID: number;
        id: number;
        jobID: number;
        savedAt: Date;
    } | {
        message: string;
    }>;
    unsaveJob(accountID: number, jobID: number): Promise<{
        userID: number;
        id: number;
        jobID: number;
        savedAt: Date;
    }>;
    getSavedJobs(dto: QueryJobsDto, accountID: number): Promise<{
        data: ({
            job: {
                company: {
                    address: string | null;
                    companyID: number;
                    companyName: string;
                    companyWebsite: string | null;
                    companyProfile: string | null;
                    companySize: string | null;
                    companyLogo: string | null;
                };
            } & {
                experienceYear: string | null;
                industryID: number | null;
                salary: string | null;
                deadline: Date | null;
                jobType: string | null;
                companyID: number;
                description: string | null;
                title: string | null;
                jobID: number;
                location: string | null;
                requirement: string | null;
                benefit: string | null;
                workingTime: string | null;
                postedAt: Date | null;
                sourcePlatform: string | null;
                sourceLink: string | null;
                isActive: boolean;
                other: string | null;
                shortLocation: string | null;
                isNewJob: boolean;
                discoveredAt: Date | null;
            };
        } & {
            userID: number;
            id: number;
            jobID: number;
            savedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getFilterOptions(): Promise<{
        jobTypes: {
            value: string | null;
            count: number;
        }[];
        sources: {
            value: string | null;
            count: number;
        }[];
        locations: {
            value: string | null;
            count: number;
        }[];
        experiences: {
            value: string | null;
            count: number;
        }[];
        industries: {
            id: number;
            name: string;
            count: number;
        }[];
    }>;
    getTrendingKeywords(): Promise<{
        name: string;
        count: number;
    }[]>;
    getFilterOptionsBySource(source?: string): Promise<{
        jobTypes: {
            value: string;
            count: number;
        }[];
        industries: {
            id: number;
            name: string;
            count: number;
        }[];
    }>;
    getJobMatch(accountID: number, jobID: number): Promise<{
        matchPercent: number;
        reason: string | null;
    } | null>;
    saveSearchHistory(accountID: number, keyword: string): Promise<void>;
    getSearchHistory(accountID: number): Promise<string[]>;
    getSearchSuggestions(q: string): Promise<{
        display: string;
        value: string;
    }[]>;
    getIndustryTrends(): Promise<{
        score: number;
        status: string;
        id: number;
        name: string;
        totalJobs: number;
        currentJobs: number;
        previousJobs: number;
        views: number;
        saves: number;
        searchScore: number;
        growthPercent: number | null;
    }[]>;
    getJobMatchPreview(accountID: number, jobID: number): Promise<{
        matchPercent: number;
        reason: string | null;
    } | null>;
    getJobMatchDetail(accountID: number, jobID: number): Promise<{
        matchPercent: number | null;
        reason: string | null;
        skillOverlap: string[];
        skillGap: string[];
        industryMatch: boolean;
        industryName: string | null;
        expMatch: boolean;
        userExp: string | null;
        jobExp: string | null;
        salaryStatus: "match" | "low" | "unknown";
        expectedSalary: string | null;
        jobSalary: string | null;
    } | null>;
}
