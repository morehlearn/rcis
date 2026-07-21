import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFirmProfileDto {
  @IsString() @IsNotEmpty()
  incorporationNo: string;

  @IsOptional() @IsString()
  firmName?: string;

  @IsString() @IsNotEmpty()
  headOffice: string;

  @IsOptional() @IsString()
  postalAddress?: string;

  @IsOptional() @IsString()
  county?: string;

  @IsString() @IsNotEmpty()
  town: string;

  @IsIn(['Local', 'Foreign'])
  localForeign: string;

  @IsOptional() @IsString()
  website?: string;

  @IsString() @IsNotEmpty()
  telephone: string;

  @IsString() @IsNotEmpty()
  cellPhone: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsString()
  latitude?: string;

  @IsOptional() @IsString()
  longitude?: string;
}