import { IsNotEmpty } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  detail: string; // 如果是 JSON 字符串，前端传字符串
}
