export declare class CreateIndustryDto {
    name: string;
}
export declare class UpdateIndustryDto {
    name: string;
}
export declare class CreateSkillDto {
    name: string;
    industryId: number;
}
export declare class UpdateSkillDto {
    name: string;
    industryId: number;
}
export declare class CreatePackageDto {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    dailyJobSuggestions: number;
    cvAnalysis: number;
    compatibilityCheck: number;
}
export declare class UpdatePackageDto {
    name?: string;
    monthlyPrice: number;
    yearlyPrice: number;
    dailyJobSuggestions?: number;
    cvAnalysis?: number;
    compatibilityCheck?: number;
}
