import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDeclarationsDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsBoolean()
  acceptCodeOfConduct: boolean;

  @IsBoolean()
  acceptTerms: boolean;
}