import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code, Repository } from 'typeorm';
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
      code: 200,
      msg: '获取详情成功',
      data: {
        id: mod.id,
        name: mod.name,
        url: mod.url,
        type: mod.type,
        detail: mod.detail,
        userId: mod.userId,
      }
    };
  }

  async create(files: any[], dto: CreateModuleDto, userId: number) {
    let type: 'json' | 'gltf' = 'json';
    let detail = dto.detail;
    let url = 'https://fastly.picsum.photos/id/825/3754/1840.jpg?hmac=TxUQK2vSxvrvHH03CCabNRBJjiB0uUh-37NVfDnm3vQ';

    const uploadDir = path.join(__dirname, '../../uploads');

    for (const file of files) {
      const filename = `${Date.now()}_${file.originalname}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, file.buffer);

      if (file.originalname.endsWith('.gltf') || file.originalname.endsWith('.glb')) {
        detail = `/uploads/${filename}`;
        type = 'gltf';
      } else if (file.mimetype.startsWith('image/')) {
        url = `/uploads/${filename}`; // 设置缩略图 URL
      }
    }

    const module = this.moduleRepo.create({
      ...dto,
      detail,
      type,
      userId,
      url // 替代默认图片
    });

    const nowFile = await this.moduleRepo.save(module);

    return {
      code: 200,
      msg: '创建成功',
      data: nowFile
    }
  }


  async remove(id: number) {
    return this.moduleRepo.delete(id);
  }

  async findByUserOrPublic(userId: number) {
    const res = await this.moduleRepo.find({
      where: [
        { userId },       // 当前用户的模块
        { userId: 0 },       // 当前用户的模块
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

    console.log(userId, res)

    return {
      code: 200,
      msg: '获取成功',
      data: res
    }
  }
}
