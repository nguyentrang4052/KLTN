import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = any>(_err: any, user: TUser): TUser {
    return user;
  }
}
