import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectExperienceDto {
  @IsOptional() @IsString() project?: string;
  @IsOptional() @IsString() ncaProjectRegNo?: string;
  @IsOptional() @IsString() contractSum?: string;
  @IsOptional() @IsString() contractPeriod?: string;
}