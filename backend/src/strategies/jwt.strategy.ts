import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenBlacklistService } from '../auth/token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private blacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'nghevn_secret',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { sub: number; email: string; role: string },
  ) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (token && this.blacklistService.has(token)) {
      throw new UnauthorizedException(
        'Token đã bị vô hiệu hóa. Vui lòng đăng nhập lại.',
      );
    }

    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
