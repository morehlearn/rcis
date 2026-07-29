import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLitigationDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  refNo: string;

  @IsString() @IsNotEmpty()
  date: string;

  @IsString() @IsNotEmpty()
  partiesInvolved: string;

  @IsString() @IsNotEmpty()
  particularOfLitigation: string;

  @IsString() @IsNotEmpty()
  statusOfMatter: string;
}