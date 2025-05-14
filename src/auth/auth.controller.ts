import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RenameDto } from './dto/rename.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return this.authService.validateUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rename')
  rename(@Request() req, @Body() dto: RenameDto) {
    return this.authService.rename(req.user.userId, dto.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('password')
  changePwd(@Request() req, @Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.userId, dto.oldPassword, dto.newPassword);
  }
}
