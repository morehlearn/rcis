import { IsOptional, IsString } from 'class-validator';

export class UpdateDirectorDto {
  @IsOptional() @IsString() idNo?: string;
  @IsOptional() @IsString() fullNames?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() highestQualification?: string;
  @IsOptional() @IsString() profession?: string;
  @IsOptional() @IsString() yearsOfExperience?: string;
  @IsOptional() @IsString() percentageShare?: string;
  @IsOptional() @IsString() cvFileName?: string;
  @IsOptional() @IsString() academicCertFileName?: string;
}