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
    const result = await this.authService.oauthLogin(req.user);

    const url = `${this.config.get<string>(
      'FRONTEND_URL',
    )}/oauth-callback?token=${result.accessToken}`;

    res.redirect(url);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(
    @Req() req: Request & { user: OAuthUser },
    @Res() res: Response,
  ) {
    const result = await this.authService.oauthLogin(req.user);

    const url = `${this.config.get<string>(
      'FRONTEND_URL',
    )}/oauth-callback?token=${result.accessToken}`;

    res.redirect(url);
  }
}
