// /backend/src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth') // Kelompokkan di Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint untuk login
   * @UseGuards(AuthGuard('local')) akan memicu LocalStrategy kita
   * Jika validasi di LocalStrategy berhasil, 'req.user' akan berisi data user
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // loginDto hanya dipakai agar Swagger menampilkan body yang benar
    // req.user sudah divalidasi oleh AuthGuard & LocalStrategy
    return this.authService.login(req.user);
  }
}