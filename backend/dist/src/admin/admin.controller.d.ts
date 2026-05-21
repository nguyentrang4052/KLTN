import { AdminService } from './admin.service';
import { CreateIndustryDto, UpdateIndustryDto, CreateSkillDto, UpdateSkillDto, CreatePackageDto, UpdatePackageDto } from '../dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        total: number;
        active: number;
        locked: number;
        notFree: number;
    }>;
    getMonthlyRegistrations(): Promise<{
        label: string;
        count: number;
    }[]>;
    getWeeklyStatus(): Promise<{
        label: string;
        active: number;
        locked: number;
    }[]>;
    getPlanDistribution(): Promise<{
        label: string;
        count: number;
    }[]>;
    getRecentUsers(): Promise<{
        id: number;
        name: string;
        email: string;
        plan: string;
        status: string;
        provider: string;
        joined: string;
    }[]>;
    getUsers(): Promise<{
        id: number;
        name: string;
        email: string;
        plan: string;
        status: string;
        provider: string;
        joined: string;
    }[]>;
    toggleStatus(id: number): Promise<{
        id: number;
        status: string;
    }>;
    getIndustries(): Promise<{
        id: number;
        name: string;
        skillCount: number;
    }[]>;
    createIndustry(dto: CreateIndustryDto): Promise<{
        name: string;
        id: number;
    }>;
    updateIndustry(id: number, dto: UpdateIndustryDto): Promise<{
        name: string;
        id: number;
    }>;
    deleteIndustry(id: number): Promise<{
        name: string;
        id: number;
    }>;
    getAllSkills(): Promise<{
        id: number;
        name: string;
        industryId: number;
        industryName: string;
    }[]>;
    createSkill(dto: CreateSkillDto): Promise<{
        industry: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        industryID: number;
        skillID: number;
    }>;
    updateSkill(id: number, dto: UpdateSkillDto): Promise<{
        industry: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        industryID: number;
        skillID: number;
    }>;
    deleteSkill(id: number): Promise<{
        name: string;
        industryID: number;
        skillID: number;
    }>;
    getPackages(): Promise<{
        id: number;
        name: string;
        displayName: string;
        monthlyPrice: number;
        yearlyPrice: number;
        users: number;
        features: {
            dailyJobSuggestions: number;
            cvAnalysis: number;
            compatibilityCheck: number;
        };
    }[]>;
    createPackage(dto: CreatePackageDto): Promise<{
        limits: {
            id: number;
            jobSuggestPerDay: number;
            planID: number;
            cvAnalysisPerMonth: number;
            cvMatchCheckCount: number;
        } | null;
    } & {
        name: string;
        createdAt: Date;
        id: number;
        displayName: string;
        monthlyPrice: number;
        yearlyPrice: number;
    }>;
    getPlatforms(): Promise<{
        name: string | null;
        jobCount: number;
    }[]>;
    getIndustriesByPlatform(platform?: string): Promise<{
        id: number;
        name: string;
        skillCount: number;
        jobCount: number;
    }[]>;
    getRefunds(status?: string): Promise<{
        id: number;
        userID: number;
        userName: string;
        userEmail: string;
        reason: string;
        accountNumber: string;
        accountName: string;
        bankName: string;
        amount: number;
        planName: string;
        billing: string;
        status: string;
        note: string | null;
        createdAt: string;
        resolvedAt: string | null;
    }[]>;
    updatePackage(id: number, dto: UpdatePackageDto): Promise<{
        id: number;
        jobSuggestPerDay: number;
        planID: number;
        cvAnalysisPerMonth: number;
        cvMatchCheckCount: number;
    }>;
    deletePackage(id: number): Promise<{
        name: string;
        createdAt: Date;
        id: number;
        displayName: string;
        monthlyPrice: number;
        yearlyPrice: number;
    }>;
    resolveRefund(id: number, body: {
        action: 'approved' | 'rejected';
        note?: string;
    }): Promise<{
        success: boolean;
        action: "approved" | "rejected";
    }>;
}
