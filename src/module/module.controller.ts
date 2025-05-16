import {
  Controller, Post, Delete, Body, Param, UseInterceptors,
  Get,
  UseGuards,
  Req,
  UploadedFiles
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: CreateModuleDto, @Req() req) {
    const userId = req.user.id;
    return this.moduleService.create(files, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.moduleService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getModulesByUser(@Req() req) {
    const userId = req.user.id;
    return this.moduleService.findByUserOrPublic(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getModuleById(@Param('id') id: number) {
    return this.moduleService.findById(id);
  }
}
