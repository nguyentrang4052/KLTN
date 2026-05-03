import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsInt,
  IsBoolean,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export type NotificationType =
  | 'subscription_expiry'
  | 'job_deadline'
  | 'job_alert'
  | 'payment_success';

export class GetNotificationsDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  unread?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  take?: number = 50;
}

export class CreateNotificationDto {
  @IsInt()
  userID: number;

  @IsEnum([
    'subscription_expiry',
    'job_deadline',
    'job_alert',
    'payment_success',
  ])
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
