import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    private blacklistService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService, blacklistService: TokenBlacklistService);
    initiateRegister(dto: RegisterDto): Promise<{
        message: string;
    }>;
    completeRegister(email: string, otp: string): Promise<{
        message: string;
        accessToken: string;
        user: {
            accountID: number;
            email: string;
            fullName: string | null | undefined;
        };
    }>;
    resendRegisterOtp(email: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            accountID: number;
            email: string;
            fullName: string | null | undefined;
            avatar: string | null;
            role: string;
        };
    }>;
    oauthLogin(oauthUser: {
        email: string;
        fullName: string;
        provider: string;
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            accountID: number;
            email: string;
            fullName: string | null | undefined;
            role: string;
        };
    }>;
    private initFreeQuota;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): {
        message: string;
    };
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    refreshToken(accountID: number, email: string, role?: string): string;
    private signToken;
    getMe(accountID: number): Promise<{
        accountID: number;
        email: string;
        fullName: string;
        phone: string | null;
        address: string | null;
        birthYear: number | null;
        gender: string | null;
        provider: string;
        avatar: string | null;
        jobTitle: string;
        plan: {
            name: string;
            createdAt: Date;
            id: number;
            displayName: string;
            monthlyPrice: number;
            yearlyPrice: number;
        } | {
            name: string;
            displayName: string;
        };
    }>;
    logout(token: string): {
        message: string;
    };
}
