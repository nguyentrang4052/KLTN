declare class PersonalInfo {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    portfolio?: string;
}
declare class Experience {
    company?: string;
    position?: string;
    duration?: string;
    description?: string;
}
declare class Education {
    institution?: string;
    degree?: string;
    year?: string;
    gpa?: string;
}
declare class Skill {
    category?: string;
    items?: string;
}
declare class Activity {
    organization?: string;
    role?: string;
    duration?: string;
    description?: string;
}
declare class Award {
    title?: string;
    issuer?: string;
    year?: string;
    description?: string;
}
declare class Certification {
    name?: string;
    issuer?: string;
    year?: string;
    score?: string;
}
export declare class CVAnalysisResultDto {
    personalInfo?: PersonalInfo;
    experiences?: Experience[];
    education?: Education[];
    skills?: Skill[];
    activities?: Activity[];
    awards?: Award[];
    certifications?: Certification[];
    summary?: string;
    rawText?: string;
}
export {};
