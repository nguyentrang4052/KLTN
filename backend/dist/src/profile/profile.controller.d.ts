import { ProfileService } from './profile.service';
import { UpdateProfileDto, UpdateUserProfileDto } from '../dto/profile.dto';
import type { JwtUser } from "../auth/interfaces/jwt-user.interface";
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getMyProfile(user: JwtUser): Promise<{
        userID: number;
        fullName: string | null;
        avatar: string | null;
        birthYear: number | null;
        phone: string | null;
        gender: string | null;
        address: string | null;
        email: string;
        provider: string;
        memberSince: Date;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
        expectedSalary: string | null;
        workingType: string | null;
        industry: {
            id: number;
            name: string;
        } | null;
        skills: {
            id: number;
            name: string;
            industry: string;
        }[];
        plan: {
            name: string;
            displayName: string;
            expiresAt: Date;
        } | {
            name: string;
            displayName: string;
            expiresAt: null;
        };
    }>;
    getAllSkills(): Promise<{
        skillID: number;
        name: string;
        industry: string;
    }[]>;
    getProfile(userID: number): Promise<{
        userID: number;
        fullName: string | null;
        avatar: string | null;
        birthYear: number | null;
        phone: string | null;
        gender: string | null;
        address: string | null;
        email: string;
        provider: string;
        memberSince: Date;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
        expectedSalary: string | null;
        workingType: string | null;
        industry: {
            id: number;
            name: string;
        } | null;
        skills: {
            id: number;
            name: string;
            industry: string;
        }[];
        plan: {
            name: string;
            displayName: string;
            expiresAt: Date;
        } | {
            name: string;
            displayName: string;
            expiresAt: null;
        };
    }>;
    updateProfile(userID: number, dto: UpdateProfileDto): Promise<{
        fullName: string | null;
        phone: string | null;
        birthYear: number | null;
        gender: string | null;
        address: string | null;
        accountID: number;
        avatar: string | null;
        userID: number;
    }>;
    uploadAvatar(userID: string, file: Express.Multer.File): Promise<{
        fullName: string | null;
        phone: string | null;
        birthYear: number | null;
        gender: string | null;
        address: string | null;
        accountID: number;
        avatar: string | null;
        userID: number;
    }>;
    removeAvatar(userID: number): Promise<{
        fullName: string | null;
        phone: string | null;
        birthYear: number | null;
        gender: string | null;
        address: string | null;
        accountID: number;
        avatar: string | null;
        userID: number;
    }>;
    updateUserProfile(userID: number, dto: UpdateUserProfileDto): Promise<{
        industry: {
            name: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        userID: number;
        id: number;
        updatedAt: Date;
        jobTitle: string | null;
        experienceYear: string | null;
        careerLevel: string | null;
        expectedSalary: string | null;
        workingType: string | null;
        industryID: number | null;
    }>;
    getSkills(userID: number): Promise<{
        id: number;
        name: string;
        industry: string;
    }[]>;
    addSkill(userID: number, skillID: number): Promise<{
        userID: number;
        id: number;
        skillID: number;
    }>;
    removeSkill(userID: number, skillID: number): Promise<{
        userID: number;
        id: number;
        skillID: number;
    }>;
    getStats(userID: number): Promise<{
        viewCount: number;
        saveCount: number;
        applyCount: number;
    }>;
    getInsights(userID: number): Promise<{
        insights: {
            icon: string;
            text: string;
            source: string;
        }[];
        preferences: {
            key: string;
            value: string;
        }[];
    }>;
}
