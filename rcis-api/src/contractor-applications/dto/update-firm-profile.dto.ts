import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateFirmProfileDto {
  @IsString()
  regno: string;

  @IsOptional() @IsString() incorporationNo?: string;
  @IsOptional() @IsString() firmName?: string;
  @IsOptional() @IsString() headOffice?: string;
  @IsOptional() @IsString() postalAddress?: string;
  @IsOptional() @IsString() county?: string;
  @IsOptional() @IsString() town?: string;
  @IsOptional() @IsIn(['Local', 'Foreign']) localForeign?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsString() cellPhone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() latitude?: string;
  @IsOptional() @IsString() longitude?: string;
}