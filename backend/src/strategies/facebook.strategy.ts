import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('FACEBOOK_APP_ID')!,
      clientSecret: config.get<string>('FACEBOOK_APP_SECRET')!,
      callbackURL: config.get<string>('FACEBOOK_CALLBACK_URL')!,
      scope: ['email'],
      profileFields: ['emails', 'name', 'displayName', 'photos'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): void {
    const { id, emails, displayName, photos } = profile;

    // nếu Facebook không trả email
    const email = emails?.[0]?.value || `${id}@facebook.local`;

    const user = {
      email,
      fullName: displayName,
      avatar: photos?.[0]?.value,
      provider: 'facebook',
    };
    done(null, user);
  }
}
