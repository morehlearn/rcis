import { IsOptional, IsString } from 'class-validator';

export class UpdateLitigationDto {
  @IsOptional() @IsString() refNo?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() partiesInvolved?: string;
  @IsOptional() @IsString() particularOfLitigation?: string;
  @IsOptional() @IsString() statusOfMatter?: string;
}