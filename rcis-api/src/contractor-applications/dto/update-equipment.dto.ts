import { IsOptional, IsString } from 'class-validator';

export class UpdateEquipmentDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() ownedOrLeased?: string;
  @IsOptional() @IsString() typeMakeModel?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() registrationNo?: string;
}