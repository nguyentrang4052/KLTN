import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendNotificationEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsString()
  @IsOptional()
  jobId?: string;
}
