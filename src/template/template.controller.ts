import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { TemplateService } from './template.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('project')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @UseGuards(JwtAuthGuard)
  @Get('modules')
  async getTemplates(@Req() req) {
    const list = await this.templateService.findAll();
    return {
      code: 200,
      message: '获取成功',
      data: list.map(t => ({ id: t.id, name: t.name })),
    };
  }
}
