import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  ownedOrLeased: string;

  @IsString() @IsNotEmpty()
  typeMakeModel: string;

  @IsString() @IsNotEmpty()
  category: string;

  @IsString() @IsNotEmpty()
  registrationNo: string;
}