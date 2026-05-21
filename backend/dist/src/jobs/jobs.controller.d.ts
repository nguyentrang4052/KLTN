import { Request } from 'express';
import { JobsService } from './jobs.service';
import { AIRecommendationService } from './ai-job-recommendation.service';
import { QueryJobsDto } from '../dto/jobs.dto';
import type { JwtUser } from "../auth/interfaces/jwt-user.interface";
import { JobsGateway } from "../websocket-gateway/jobs.gateway";
import { SubscriptionService } from '../subscription/subscription.service';
interface RequestWithUser extends Request {
    user?: JwtUser;
}
export declare class JobsController {
    private readonly jobsService;
    private readonly aiRecommendation;
    private readonly jobsGateway;
    private readonly subscriptionService;
    constructor(jobsService: JobsService, aiRecommendation: AIRecommendationService, jobsGateway: JobsGateway, subscriptionService: SubscriptionService);
    getJobs(dto: QueryJobsDto, req: RequestWithUser): Promise<{
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
    getUserStats(user: JwtUser): Promise<{
        jobMatch: {
            count: number;
            delta: string;
            label: string;
        };
    } | null>;
    getRecommendations(user: JwtUser): Promise<{
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
    refreshRecommendations(user: JwtUser): Promise<{
        hasChanged: boolean;
        message: string;
        data: never[];
        quota: null;
    } | {
        hasChanged: boolean;
        message: string;
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
    getSavedJobs(dto: QueryJobsDto, user: JwtUser): Promise<{
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
    getFilterBySource(source?: string): Promise<{
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
    saveSearchHistory(keyword: string, req: RequestWithUser): Promise<void>;
    getSearchHistory(user: JwtUser): Promise<string[]>;
    getSearchSuggestions(q: string): Promise<{
        display: string;
        value: string;
    }[]>;
    broadcastNewJobs(count: number, secret: string): {
        ok: boolean;
    } | undefined;
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
    getJobById(id: number): Promise<{
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
    trackBehavior(jobID: number, action: string, user: JwtUser): Promise<void>;
    getJobMatch(jobID: number, user: JwtUser): Promise<{
        matchPercent: number;
        reason: string | null;
    } | null>;
    checkJobMatchDetail(jobID: number, user: JwtUser): Promise<{
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
    saveJob(jobID: number, user: JwtUser): Promise<{
        userID: number;
        id: number;
        jobID: number;
        savedAt: Date;
    } | {
        message: string;
    }>;
    unsaveJob(jobID: number, user: JwtUser): Promise<{
        userID: number;
        id: number;
        jobID: number;
        savedAt: Date;
    }>;
}
export {};
