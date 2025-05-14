import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepo: Repository<Module>
  ) {}

  // module.service.ts
  async findById(id: number) {
    const mod = await this.moduleRepo.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');

    return {
      id: mod.id,
      name: mod.name,
      url: mod.url,
      type: mod.type,
      detail: mod.detail,
      userId: mod.userId,
    };
  }

  async create(file: any, dto: CreateModuleDto) {
    let type: 'json' | 'gltf' = 'json';
    let detail = dto.detail || '';
    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      const filepath = path.join(__dirname, '../../uploads', filename);
      fs.writeFileSync(filepath, file.buffer);
      detail = `/uploads/${filename}`;
      type = 'gltf';
    }

    const module = this.moduleRepo.create({
      ...dto,
      detail,
      type
    });

    return this.moduleRepo.save(module);
  }

  async remove(id: number) {
    return this.moduleRepo.delete(id);
  }

  async findByUserOrPublic(userId: number) {
    return this.moduleRepo.find({
      where: [
        { userId },       // 当前用户的模块
        { userId: null as unknown as undefined }, // 公共模块
      ],
      select: {
        id: true,
        name: true,
        url: true,
        updateTime: true,
        createTime: true,
        type: true
      },
    });
  }
}
