import { IsOptional, IsString } from 'class-validator';

export class UpdateStaffDto {
  @IsOptional() @IsString() fullNames?: string;
  @IsOptional() @IsString() idNo?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() highestQualification?: string;
  @IsOptional() @IsString() yearsOfExperience?: string;
}