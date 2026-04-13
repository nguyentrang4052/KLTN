import { IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PersonalInfo {
  @IsString() fullName?: string;
  @IsString() email?: string;
  @IsString() phone?: string;
  @IsString() address?: string;
  @IsString() linkedin?: string;
  @IsString() portfolio?: string;
}

class Experience {
  @IsString() company?: string;
  @IsString() position?: string;
  @IsString() duration?: string;
  @IsString() description?: string;
}

class Education {
  @IsString() institution?: string;
  @IsString() degree?: string;
  @IsString() year?: string;
  @IsString() gpa?: string;
}

class Skill {
  @IsString() category?: string;
  @IsString() items?: string;
}

class Activity {
  @IsString() organization?: string;
  @IsString() role?: string;
  @IsString() duration?: string;
  @IsString() description?: string;
}

class Award {
  @IsString() title?: string;
  @IsString() issuer?: string;
  @IsString() year?: string;
  @IsString() description?: string;
}

class Certification {
  @IsString() name?: string;
  @IsString() issuer?: string;
  @IsString() year?: string;
@IsString() score?: string; 
}

export class CVAnalysisResultDto {
  @ValidateNested()
  @Type(() => PersonalInfo)
  personalInfo?: PersonalInfo;

  @ValidateNested({ each: true })
  @Type(() => Experience)
  experiences?: Experience[];

  @ValidateNested({ each: true })
  @Type(() => Education)
  education?: Education[];

  @ValidateNested({ each: true })
  @Type(() => Skill)
  skills?: Skill[];

  @ValidateNested({ each: true })
  @Type(() => Activity)
  activities?: Activity[];

  @ValidateNested({ each: true })
  @Type(() => Award)
  awards?: Award[];

  @ValidateNested({ each: true })
  @Type(() => Certification)
  certifications?: Certification[];

  @IsString() summary?: string;
  @IsString() rawText?: string;
}