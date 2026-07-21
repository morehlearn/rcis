import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFirmRegistrationDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsOptional() @IsString() firmType?: string;
  @IsOptional() @IsString() kraPin?: string;
  @IsOptional() @IsString() registeredCapital?: string;
  @IsOptional() @IsString() paidUpCapital?: string;
  @IsOptional() @IsString() taxComplianceNo?: string;
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsString() bankBranch?: string;
  @IsOptional() @IsString() agencyName?: string;
  @IsOptional() @IsString() agencyRegistrationNo?: string;
  @IsOptional() @IsString() agencyYear?: string;
  @IsOptional() @IsString() associationName?: string;
  @IsOptional() @IsString() associationNameOther?: string;
  @IsOptional() @IsString() associationMembershipNo?: string;
  @IsOptional() @IsString() jointVentureProjects?: string;
  @IsOptional() @IsString() jointVentureFirms?: string;
  @IsOptional() @IsString() hasAgpoCertificate?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  agpoCategories?: string[];

  @IsOptional() @IsString()
  agpoExpiryDate?: string;
}