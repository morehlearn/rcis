import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectExperienceDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  project: string;

  @IsString() @IsNotEmpty()
  ncaProjectRegNo: string;

  @IsString() @IsNotEmpty()
  contractSum: string;

  @IsString() @IsNotEmpty()
  contractPeriod: string;
}