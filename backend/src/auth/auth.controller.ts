import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

import type { Response, Request } from 'express';
import { OAuthUser } from './interfaces/oauth-user.interface';
import { GetUser } from './decorators/get-user.decorator';
import * as jwtUserInterface from './interfaces/jwt-user.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user: OAuthUser },
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.oauthLogin(req.user);
      const name = result.user.fullName ?? '';
      const url = `${this.config.get<string>('FRONTEND_URL')}/oauth-callback?token=${result.accessToken}&email=${encodeURIComponent(result.user.email)}&name=${encodeURIComponent(name)}&role=${result.user.role ?? 'user'}`;
      res.redirect(url);
    } catch (err) {
      const url = `${this.config.get<string>('FRONTEND_URL')}/login?error=${encodeURIComponent(err.message)}`;
      res.redirect(url);
    }
  }

  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@GetUser() user: jwtUserInterface.JwtUser) {
    const newToken = this.authService.refreshToken(
      user.sub,
      user.email,
      user.role,
    );
    return { accessToken: newToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: jwtUserInterface.JwtUser) {
    return this.authService.getMe(user.sub);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Authorization token is missing');
    }
    return this.authService.logout(token);
  }
}
