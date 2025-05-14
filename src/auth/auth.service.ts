import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: { username: string; password: string }) {
    const exists = await this.userRepo.findOneBy({ username: dto.username });
    if (exists) throw new BadRequestException('用户名已存在');
    const user = this.userRepo.create({
      username: dto.username,
      password: await bcrypt.hash(dto.password, 10),
    });
    return this.userRepo.save(user);
  }

  async login(dto: { username: string; password: string }) {
    const user = await this.userRepo.findOneBy({ username: dto.username });
    if (!user) throw new BadRequestException('用户不存在');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new BadRequestException('密码错误');

    const token = this.jwtService.sign({ userId: user.id });
    return { token };
  }

  async validateUser(userId: number) {
    return this.userRepo.findOneBy({ id: userId });
  }

  async rename(userId: number, username: string) {
    const exists = await this.userRepo.findOneBy({ username });
    if (exists) throw new BadRequestException('用户名已存在');
    await this.userRepo.update(userId, { username });
    return { success: true };
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestException('账号或密码错误');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepo.save(user);
  }
}
