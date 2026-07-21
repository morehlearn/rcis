import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { AccountType } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @ValidateIf((o) => o.accountType === AccountType.LOCAL_CONTRACTOR || o.accountType === AccountType.FOREIGN_CONTRACTOR)
  @IsString()
  @IsNotEmpty({ message: 'Company name is required for contractor accounts' })
  companyName?: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}