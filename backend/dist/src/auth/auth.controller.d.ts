import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import type { Response, Request } from 'express';
import { OAuthUser } from './interfaces/oauth-user.interface';
import * as jwtUserInterface from './interfaces/jwt-user.interface';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    initiateRegister(dto: RegisterDto): Promise<{
        message: string;
    }>;
    completeRegister(body: {
        email: string;
        otp: string;
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            accountID: number;
            email: string;
            fullName: string | null | undefined;
        };
    }>;
    resendRegisterOtp(body: {
        email: string;
    }): Promise<{
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): {
        message: string;
    };
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleLogin(): void;
    googleCallback(req: Request & {
        user: OAuthUser;
    }, res: Response): Promise<void>;
    refreshToken(user: jwtUserInterface.JwtUser): {
        accessToken: string;
    };
    getMe(user: jwtUserInterface.JwtUser): Promise<{
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
    logout(req: Request): {
        message: string;
    };
}
