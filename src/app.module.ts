import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { TemplateModule } from './template/template.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // TODO：生产环境关掉
      synchronize: true, // 自动建表
    }),
    ProjectModule,
    AuthModule,
    TemplateModule,
    ModuleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}