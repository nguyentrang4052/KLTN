declare class PersonalInfoDto {
    fullName?: string;
    phone?: string;
    address?: string;
    email?: string;
    linkedin?: string;
    portfolio?: string;
}
declare class ExperienceDto {
    company?: string;
    position?: string;
    duration?: string;
    description?: string;
}
declare class SkillDto {
    category?: string;
    items?: string;
}
export declare class MapFromLocalCvDto {
    personalInfo?: PersonalInfoDto;
    experiences?: ExperienceDto[];
    education?: any[];
    skills?: (string | SkillDto)[];
    summary?: string;
}
export {};
