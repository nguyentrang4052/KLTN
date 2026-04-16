import { IsBoolean } from 'class-validator';

export class UpdateEmailPreferenceDto {
  @IsBoolean()
  emailNotificationsEnabled: boolean;
}