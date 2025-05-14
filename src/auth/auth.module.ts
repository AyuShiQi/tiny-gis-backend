import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 引入 ConfigModule 和 ConfigService

@Module({
  imports: [
    ConfigModule.forRoot(),  // 加载环境变量
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],  // 确保 ConfigModule 在 JwtModule 中可用
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // 从环境变量中读取 JWT_SECRET
        signOptions: { expiresIn: '7d' },  // 设置 token 过期时间
      }),
      inject: [ConfigService],  // 注入 ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 确保 JwtStrategy 作为 provider 被正确注入
})
export class AuthModule {}

