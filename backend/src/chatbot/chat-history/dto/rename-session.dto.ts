import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RenameSessionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title!: string;
}