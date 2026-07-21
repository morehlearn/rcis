import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  idNo: string;

  @IsString() @IsNotEmpty()
  fullNames: string;

  @IsString() @IsNotEmpty()
  nationality: string;

  @IsString() @IsNotEmpty()
  highestQualification: string;

  @IsString() @IsNotEmpty()
  profession: string;

  @IsString() @IsNotEmpty()
  yearsOfExperience: string;

  @IsString() @IsNotEmpty()
  percentageShare: string;

  @IsOptional() @IsString()
  cvFileName?: string;

  @IsOptional() @IsString()
  academicCertFileName?: string;
}