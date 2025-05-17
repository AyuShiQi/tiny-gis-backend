import { Controller, Post, Body, UseGuards, Request, Get, Req, Query, ForbiddenException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { CreateProjDto } from './dto/create-proj.dto';
import { GetProjsRes } from './interface/project';
import { Project } from './entities/project.entity';
import * as fs from 'fs';
import * as path from 'path';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req, @Body() dto: CreateProjDto) {
    const userId = req.user.userId;
    const proj = await this.projectService.create(dto, userId);
    return {
      code: 200,
      message: '项目创建成功',
      data: {
        id: proj.id
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('lists')
  async getProjectList(@Req() req): Promise<GetProjsRes> {
    const userId = req.user.id;
    console.log(req.user, 233)
    const data = await this.projectService.getUserProjects(userId);
    return {
      code: 200,
      message: '获取成功',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail')
  async getProjectDetail(
    @Query('id') id: string
  ): Promise<{ code: number; message: string; data: Project }> {
    const project = await this.projectService.getProjectById(id);
    return {
      code: 200,
      message: '获取成功',
      data: project,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteProject(
    @Req() req,
    @Body('id') id: string
  ): Promise<{ code: number; message: string }> {
    await this.projectService.deleteProjectById(id);
    return {
      code: 200,
      message: '删除成功',
    };
  }


  @UseGuards(JwtAuthGuard)
  @Post('update')
  @UseInterceptors(AnyFilesInterceptor())
  async update(@UploadedFiles() files: Array<Express.Multer.File>, @Body() dto, @Req() req) {
    const { id, title, modelsArr, globalObj } = dto;
  
    const project = await this.projectService.findById(id);

    if (!project) {
      throw new ForbiddenException('项目不存在');
    }

    let url = 'https://picsum.photos/seed/edAp1/1680/1986'
    const uploadDir = path.join(__dirname, '../../uploads');
    for (const file of files) {
      const filename = `${Date.now()}_${file.originalname}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, file.buffer);

      if (file.mimetype.startsWith('image/')) {
        project.url = `/uploads/${filename}`; // 设置缩略图 URL
      }
    }

    if (title) {
      project.title = title;
    }

    if (modelsArr) {
      project.modelsArr = modelsArr;
    }

    if (globalObj) {
      project.globalObj = globalObj;
    }

    const updated = await this.projectService.save(project);

    return {
      code: 200,
      message: '更新成功',
      data: updated,
    };
  }

}
