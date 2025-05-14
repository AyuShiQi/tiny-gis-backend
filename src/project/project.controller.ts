import { Controller, Post, Body, UseGuards, Request, Get, Req, Query, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { CreateProjDto } from './dto/create-proj.dto';
import { GetProjsRes } from './interface/project';
import { Project } from './entities/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req, @Body() dto: CreateProjDto) {
    const userId = req.user.userId;
    const proj = await this.projectService.create(dto, userId);
    return {
      code: 0,
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
    const data = await this.projectService.getUserProjects(userId);
    return {
      code: 0,
      message: 'success',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail')
  async getProjectDetail(
    @Query('id') id: string
  ): Promise<{ code: number; message: string; data: Project }> {
    const project = await this.projectService.getProjectById(Number(id));
    return {
      code: 0,
      message: 'success',
      data: project,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteProject(
    @Req() req,
    @Body('id') id: string
  ): Promise<{ code: number; message: string }> {
    await this.projectService.deleteProjectById(Number(id));
    return {
      code: 0,
      message: '删除成功',
    };
  }


  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateProject(@Body() body: any, @Req() req): Promise<{ code: number; message: string, data: Project }> {
    const { id, title, modelsArr, globalObj } = body;

    const project = await this.projectService.findById(id);

    if (!project) {
      throw new ForbiddenException('项目不存在');
    }

    if (title) {
      project.title = title;
    }

    if (modelsArr) {
      project.modelsArr = JSON.parse(modelsArr);
    }

    if (globalObj) {
      project.globalObj = JSON.parse(globalObj);
    }

    const updated = await this.projectService.save(project);
    return {
      code: 0,
      message: 'success',
      data: updated,
    };
  }

}
