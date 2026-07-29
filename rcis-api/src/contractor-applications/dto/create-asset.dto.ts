import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsString() @IsNotEmpty()
  registrationNo: string;
}