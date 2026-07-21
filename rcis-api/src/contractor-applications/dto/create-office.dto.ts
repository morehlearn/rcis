import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOfficeDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  town: string;

  @IsString() @IsNotEmpty()
  address: string;

  @IsString() @IsNotEmpty()
  location: string;
}