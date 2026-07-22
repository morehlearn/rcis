import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRefereeDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  postalAddress: string;

  @IsString() @IsNotEmpty()
  telephone: string;

  @IsString() @IsNotEmpty()
  profession: string;
}