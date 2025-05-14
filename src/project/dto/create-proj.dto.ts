import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export enum CreateProjMode {
  Default = 0,
  Template = 1
}

export class CreateProjDto {
  @IsString()
  title: string;

  @ArrayMinSize(2)
  coordinates: [number, number];

  @IsNumber()
  radius: number;

  @IsEnum(CreateProjMode)
  mode: CreateProjMode;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsBoolean()
  layers: boolean;
}
