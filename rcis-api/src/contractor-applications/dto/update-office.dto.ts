import { IsOptional, IsString } from 'class-validator';

export class UpdateOfficeDto {
  @IsOptional() @IsString() town?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() location?: string;
}