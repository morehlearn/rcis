import { IsOptional, IsString } from 'class-validator';

export class UpdateRefereeDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() postalAddress?: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsString() profession?: string;
}