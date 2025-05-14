import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
  ) {}

  findAll(): Promise<Template[]> {
    return this.templateRepo.find();
  }

  findById(id: number): Promise<Template | null> {
    return this.templateRepo.findOneBy({ id });
  }
}
