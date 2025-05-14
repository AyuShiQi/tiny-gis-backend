import {
  Controller, Post, Delete, Body, Param, UploadedFile, UseInterceptors,
  Get,
  Query
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: any, @Body() dto: CreateModuleDto) {
    return this.moduleService.create(file, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.moduleService.remove(id);
  }

  @Get('list')
  async getModulesByUser(@Query('userId') userId: number) {
    return this.moduleService.findByUserOrPublic(userId);
  }

  @Get(':id')
  async getModuleById(@Param('id') id: number) {
    return this.moduleService.findById(id);
  }
}
