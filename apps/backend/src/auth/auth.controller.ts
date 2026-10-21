import { Controller, Post, Body, Get, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản khách hàng mới' })
  async register(
    @Body()
    body: RegisterDto, @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(body);
    this.setSessionCookie(response, result.token);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống (Admin & Khách hàng)' })
  async login(
    @Body()
    body: LoginDto, @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body.email, body.password);
    this.setSessionCookie(response, result.token);
    return result;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('progear_session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
    return { success: true };
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lấy thông tin profile người dùng hiện tại' })
  async getProfile(@Request() req: any) {
    return req.user;
  }

  private setSessionCookie(response: Response, token: string) {
    response.cookie('progear_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
