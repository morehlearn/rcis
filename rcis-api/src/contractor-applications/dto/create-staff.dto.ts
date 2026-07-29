import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  fullNames: string;

  @IsString() @IsNotEmpty()
  idNo: string;

  @IsString() @IsNotEmpty()
  nationality: string;

  @IsString() @IsNotEmpty()
  highestQualification: string;

  @IsString() @IsNotEmpty()
  yearsOfExperience: string;
}