import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { TokenBlacklistService } from './token-blacklist.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

const otpStore = new Map<string, { otp: string; expiredAt: Date }>();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private blacklistService: TokenBlacklistService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email đã được sử dụng.');

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

    return {
      message: 'Đăng ký thành công.',
      accessToken: this.signToken(account.accountID, account.email),
      user: {
        accountID: account.accountID,
        email: account.email,
        fullName: account.user?.fullName,
        address: account.user?.address,
        phone: account.user?.phone,
        birthYear: account.user?.birthYear,
        gender: account.user?.gender,
      },
    };
  }

  async login(dto: LoginDto) {
    const account = await this.prisma.account.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });

    if (!account || !account.active)
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');

    const pwMatch = await bcrypt.compare(dto.password, account.password);
    if (!pwMatch)
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');

    return {
      message: 'Đăng nhập thành công.',
      accessToken: this.signToken(account.accountID, account.email),
      user: {
        accountID: account.accountID,
        email: account.email,
        fullName: account.user?.fullName,
        avatar: account.user?.avatar ?? null,
      },
    };
  }

  async oauthLogin(oauthUser: {
    email: string;
    fullName: string;
    provider: string;
  }) {
    let account = await this.prisma.account.findUnique({
      where: { email: oauthUser.email },
      include: { user: true },
    });

    if (!account) {
      account = await this.prisma.account.create({
        data: {
          email: oauthUser.email,
          password: '',
          provider: oauthUser.provider,
          user: {
            create: {
              fullName: oauthUser.fullName,
            },
          },
        },
        include: { user: true },
      });
    }

    return {
      message: 'Đăng nhập thành công.',
      accessToken: this.signToken(account.accountID, account.email),
      user: {
        accountID: account.accountID,
        email: account.email,
        fullName: account.user?.fullName,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const account = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });

    if (!account) {
      throw new NotFoundException('Email chưa được đăng ký.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    otpStore.set(dto.email, { otp, expiredAt });

    await this.mailService.sendOtp(dto.email, otp);

    return { message: 'Mã OTP đã được gửi tới email của bạn.' };
  }

  verifyOtp(dto: VerifyOtpDto) {
    const record = otpStore.get(dto.email);

    if (!record)
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn.');
    if (new Date() > record.expiredAt)
      throw new BadRequestException('Mã OTP đã hết hạn.');
    if (record.otp !== dto.otp)
      throw new BadRequestException('Mã OTP không đúng.');

    return { message: 'Xác minh OTP thành công.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = otpStore.get(dto.email);

    if (!record || record.otp !== dto.otp || new Date() > record.expiredAt)
      throw new BadRequestException('Phiên đặt lại mật khẩu không hợp lệ.');

    const account = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });
    if (!account) throw new NotFoundException('Tài khoản không tồn tại.');

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.account.update({
      where: { email: dto.email },
      data: { password: hashed },
    });

    otpStore.delete(dto.email);

    return { message: 'Đặt lại mật khẩu thành công.' };
  }

  refreshToken(accountID: number, email: string): string {
    return this.signToken(accountID, email);
  }

  private signToken(accountID: number, email: string): string {
    return this.jwtService.sign(
      { sub: accountID, email },
      { expiresIn: '24h' },
    );
  }

  async getMe(accountID: number) {
    const account = await this.prisma.account.findUnique({
      where: { accountID },
      include: {
        user: {
          include: {
            profiles: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!account) throw new NotFoundException('Tài khoản không tồn tại.');

    const latestProfile = account.user?.profiles?.[0];

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
    };
  }

  logout(token: string): { message: string } {
    this.blacklistService.add(token);
    return { message: 'Đăng xuất thành công.' };
  }
}
