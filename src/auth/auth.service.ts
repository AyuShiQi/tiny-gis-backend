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
    const savedUser = await this.userRepo.save(user);

    return {
      code: 200,
      message: '注册成功',
      data: {
        id: savedUser.id,
      },
    };
  }

  async login(dto: { username: string; password: string }) {
    const user = await this.userRepo.findOneBy({ username: dto.username });
    if (!user) throw new BadRequestException('账户或密码错误');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new BadRequestException('账户或密码错误');

    const token = this.jwtService.sign({ userId: user.id });
    return {
      code: 200,
      message: '登录成功',
      data: {
        token,
      },
     };
  }

  async validateUser(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('用户不存在');

    return {
      code: 200,
      message: '获取成功',
      data: {
        id: user.id,
        username: user.username
      },
    }
  }

  async rename(userId: number, username: string) {
    const exists = await this.userRepo.findOneBy({ username });
    if (exists) throw new BadRequestException('用户名已存在');

    await this.userRepo.update(userId, { username });
    return { 
      code: 200,
      message: '更名成功',
      data: null,
     };
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestException('用户不存在');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user)
    return { 
      code: 200,
      message: '更换密码成功',
      data: null,
     };
  }
}
