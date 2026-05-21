"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const token_blacklist_service_1 = require("./token-blacklist.service");
const bcrypt = __importStar(require("bcrypt"));
const otpStore = new Map();
const registerOtpStore = new Map();
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    blacklistService;
    constructor(prisma, jwtService, mailService, blacklistService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.blacklistService = blacklistService;
    }
    async initiateRegister(dto) {
        const existing = await this.prisma.account.findUnique({
            where: { email: dto.email },
        });
        if (existing)
            throw new common_1.ConflictException('Email đã được sử dụng.');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
        registerOtpStore.set(dto.email, { otp, expiredAt, payload: dto });
        await this.mailService.sendOtp(dto.email, otp);
        return { message: 'Mã OTP đã được gửi tới email của bạn.' };
    }
    async completeRegister(email, otp) {
        const record = registerOtpStore.get(email);
        if (!record)
            throw new common_1.BadRequestException('Phiên đăng ký không tồn tại hoặc đã hết hạn.');
        if (new Date() > record.expiredAt)
            throw new common_1.BadRequestException('Mã OTP đã hết hạn.');
        if (record.otp !== otp)
            throw new common_1.BadRequestException('Mã OTP không đúng.');
        const existing = await this.prisma.account.findUnique({
            where: { email },
        });
        if (existing)
            throw new common_1.ConflictException('Email đã được sử dụng.');
        const dto = record.payload;
        const hashed = await bcrypt.hash(dto.password, 10);
        const account = await this.prisma.account.create({
            data: {
                email: dto.email,
                password: hashed,
                provider: 'local',
                user: {
                    create: {
                        fullName: dto.fullName,
                        phone: dto.phone ?? null,
                        birthYear: dto.birthYear ?? null,
                        gender: dto.gender ?? null,
                        address: dto.address ?? null,
                    },
                },
            },
            include: { user: true },
        });
        if (account.user) {
            await this.initFreeQuota(account.user.userID);
        }
        registerOtpStore.delete(email);
        return {
            message: 'Đăng ký thành công.',
            accessToken: this.signToken(account.accountID, account.email, account.role),
            user: {
                accountID: account.accountID,
                email: account.email,
                fullName: account.user?.fullName,
            },
        };
    }
    async resendRegisterOtp(email) {
        const record = registerOtpStore.get(email);
        if (!record)
            throw new common_1.BadRequestException('Phiên đăng ký không tồn tại. Vui lòng thử lại từ đầu.');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
        registerOtpStore.set(email, { ...record, otp, expiredAt });
        await this.mailService.sendOtp(email, otp);
        return { message: 'Mã OTP mới đã được gửi.' };
    }
    async login(dto) {
        const account = await this.prisma.account.findUnique({
            where: { email: dto.email },
            include: { user: true },
        });
        if (!account)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng.');
        if (!account.active)
            throw new common_1.UnauthorizedException('Tài khoản đã bị vô hiệu hóa.');
        const pwMatch = await bcrypt.compare(dto.password, account.password);
        if (!pwMatch)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng.');
        return {
            message: 'Đăng nhập thành công.',
            accessToken: this.signToken(account.accountID, account.email, account.role),
            user: {
                accountID: account.accountID,
                email: account.email,
                fullName: account.user?.fullName,
                avatar: account.user?.avatar ?? null,
                role: account.role,
            },
        };
    }
    async oauthLogin(oauthUser) {
        let account = await this.prisma.account.findUnique({
            where: { email: oauthUser.email },
            include: { user: true },
        });
        if (account && !account.active) {
            throw new common_1.UnauthorizedException('Tài khoản đã bị vô hiệu hóa.');
        }
        if (!account) {
            account = await this.prisma.account.create({
                data: {
                    email: oauthUser.email,
                    password: '',
                    provider: oauthUser.provider,
                    user: {
                        create: { fullName: oauthUser.fullName },
                    },
                },
                include: { user: true },
            });
            if (account.user) {
                await this.initFreeQuota(account.user.userID);
            }
        }
        return {
            message: 'Đăng nhập thành công.',
            accessToken: this.signToken(account.accountID, account.email, account.role),
            user: {
                accountID: account.accountID,
                email: account.email,
                fullName: account.user?.fullName,
                role: account.role,
            },
        };
    }
    async initFreeQuota(userID) {
        const freePlan = await this.prisma.subscriptionPlan.findFirst({
            where: { name: 'free' },
            include: { limits: true },
        });
        const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
        await this.prisma.userQuota.create({
            data: {
                userID,
                subscriptionID: null,
                jobSuggestPerDay: freePlan?.limits?.jobSuggestPerDay ?? 3,
                jobSuggestUsedToday: 0,
                jobSuggestResetDate: today,
                cvAnalysisTotal: 10,
                cvMatchCheckTotal: 20,
                cvAnalysisUsed: 0,
                cvMatchCheckUsed: 0,
            },
        });
    }
    async forgotPassword(dto) {
        const account = await this.prisma.account.findUnique({
            where: { email: dto.email },
        });
        if (!account) {
            throw new common_1.NotFoundException('Email chưa được đăng ký.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
        otpStore.set(dto.email, { otp, expiredAt });
        await this.mailService.sendOtp(dto.email, otp);
        return { message: 'Mã OTP đã được gửi tới email của bạn.' };
    }
    verifyOtp(dto) {
        const record = otpStore.get(dto.email);
        if (!record)
            throw new common_1.BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn.');
        if (new Date() > record.expiredAt)
            throw new common_1.BadRequestException('Mã OTP đã hết hạn.');
        if (record.otp !== dto.otp)
            throw new common_1.BadRequestException('Mã OTP không đúng.');
        return { message: 'Xác minh OTP thành công.' };
    }
    async resetPassword(dto) {
        const record = otpStore.get(dto.email);
        if (!record || record.otp !== dto.otp || new Date() > record.expiredAt)
            throw new common_1.BadRequestException('Phiên đặt lại mật khẩu không hợp lệ.');
        const account = await this.prisma.account.findUnique({
            where: { email: dto.email },
        });
        if (!account)
            throw new common_1.NotFoundException('Tài khoản không tồn tại.');
        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.account.update({
            where: { email: dto.email },
            data: { password: hashed },
        });
        otpStore.delete(dto.email);
        return { message: 'Đặt lại mật khẩu thành công.' };
    }
    refreshToken(accountID, email, role = 'user') {
        return this.signToken(accountID, email, role);
    }
    signToken(accountID, email, role = 'user') {
        return this.jwtService.sign({ sub: accountID, email, role }, { expiresIn: '7d' });
    }
    async getMe(accountID) {
        const account = await this.prisma.account.findUnique({
            where: { accountID },
            include: {
                user: {
                    include: {
                        profiles: true,
                    },
                },
            },
        });
        if (!account)
            throw new common_1.NotFoundException('Tài khoản không tồn tại.');
        const latestProfile = account.user?.profiles ?? null;
        const sub = await this.prisma.userSubscription.findFirst({
            where: {
                userID: account.user?.userID,
                status: 'active',
                expiresAt: { gt: new Date() },
            },
            include: { plan: true },
            orderBy: { startedAt: 'desc' },
        });
        return {
            accountID: account.accountID,
            email: account.email,
            fullName: account.user?.fullName ?? '',
            phone: account.user?.phone ?? null,
            address: account.user?.address ?? null,
            birthYear: account.user?.birthYear ?? null,
            gender: account.user?.gender ?? null,
            provider: account.provider,
            avatar: account.user?.avatar ?? null,
            jobTitle: latestProfile?.jobTitle ?? 'Thành viên',
            plan: sub?.plan ?? { name: 'free', displayName: 'free' },
        };
    }
    logout(token) {
        this.blacklistService.add(token);
        return { message: 'Đăng xuất thành công.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        token_blacklist_service_1.TokenBlacklistService])
], AuthService);
//# sourceMappingURL=auth.service.js.map