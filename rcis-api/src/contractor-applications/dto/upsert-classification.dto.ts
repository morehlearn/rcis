import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpsertClassificationDto {
  @IsString() @IsNotEmpty()
  regno: string;

  @IsString() @IsNotEmpty()
  applicationType: string;

  @IsString() @IsNotEmpty()
  buildingWorksCategory: string;

  @IsString() @IsNotEmpty()
  roadWorksCategory: string;

  @IsString() @IsNotEmpty()
  waterWorksCategory: string;

  @IsArray() @IsString({ each: true })
  electricalSubClasses: string[];

  @IsString() @IsNotEmpty()
  electricalCategory: string;

  @IsArray() @IsString({ each: true })
  mechanicalSubClasses: string[];

  @IsString() @IsNotEmpty()
  mechanicalCategory: string;
}