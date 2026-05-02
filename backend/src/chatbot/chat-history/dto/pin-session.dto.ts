import { IsBoolean } from 'class-validator';

export class PinSessionDto {
    @IsBoolean()
    isPinned!: boolean;
}