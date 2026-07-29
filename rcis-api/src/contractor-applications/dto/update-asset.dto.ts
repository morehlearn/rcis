import { IsOptional, IsString } from 'class-validator';

export class UpdateAssetDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() registrationNo?: string;
}