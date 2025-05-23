import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjDto } from './dto/create-proj.dto';
import { defaultGlobalObj } from './constants/default';
import { User } from 'src/auth/entities/user.entity';
import { Template } from '../template/entities/template.entity';
import { ListProject } from './interface/project';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>
  ) {}

  async create(dto: CreateProjDto, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error('用户不存在');

    let modelsArr: any[] = [];
    let globalObj: any = defaultGlobalObj;

    if (dto.mode === 1 && dto.templateId) {
      const template = await this.templateRepo.findOneBy({ id: +dto.templateId });
      if (!template) throw new Error('模板不存在');
      modelsArr = JSON.parse(template.modelsArr);
      globalObj = JSON.parse(template.globalObj);
    }

    const proj = this.projRepo.create({
      ...dto,
      layers: String(dto.layers) === 'false' ? 0 : 1,
      coordinates: JSON.stringify(dto.coordinates),
      modelsArr: JSON.stringify(modelsArr),
      globalObj: JSON.stringify(globalObj),
      userId: user.id,
      url: 'https://picsum.photos/seed/edAp1/1680/1986',
    });

    return this.projRepo.save(proj);
  }

  async getUserProjects(userId: number): Promise<ListProject[]> {
    const projects = await this.projRepo.find({
      where: { userId: userId },
      order: { updateTime: 'DESC' },
    });

    return projects.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      createTime: p.createTime.toISOString(),
      updateTime: p.updateTime.toISOString(),
      modelsArr: JSON.parse(p.modelsArr),
      globalObj: JSON.parse(p.globalObj),
      url: p.url,
      coordinates: JSON.parse(p.coordinates),
      radius: p.radius,
      layers: p.layers === 1 ? true : false,
      userId: p.userId
    }));
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projRepo.findOne({
      where: { id },
    });

    if (!project) throw new NotFoundException('项目不存在');
    
    return {
      ...project,
      layers: (project.layers === 1 ? true : false) as unknown as number,
    };
  }

  async deleteProjectById(id: string): Promise<void> {
    const project = await this.projRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('项目不存在');

    await this.projRepo.delete({ id });
  }

  async findById(id: string) {
    return this.projRepo.findOneBy({ id });
  }

  async save(project: Project) {
    return this.projRepo.save(project);
  }

}
