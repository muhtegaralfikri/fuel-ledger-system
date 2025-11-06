// /backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Memvalidasi user (dipakai oleh LocalStrategy)
   * @param email - Ganti dari username
   * @param pass - Password dari body
   * @returns User object jika valid, null jika tidak
   */
  async validateUser(email: string, pass: string): Promise<any> { // <-- Ganti 'username'
    // 1. Cari user berdasarkan email
    const user = await this.usersService.findOneByEmail(email); // <-- Ganti method
    if (!user) {
      return null; // User tidak ditemukan
    }

    // 2. Bandingkan password (ini tetap sama)
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (isPasswordMatching) {
      // 3. Jika cocok, kembalikan user (tanpa password)
      const { password, ...result } = user;
      return result;
    }

    return null; // Password salah
  }

  /**
   * Membuat JWT Token (dipakai oleh AuthController)
   * @param user - User object yang sudah divalidasi
   * @returns object berisi access_token
   */
  async login(user: UserEntity) {
    // Buat payload untuk JWT
    const payload = {
      username: user.username,
      sub: user.id, // 'sub' (subject) adalah standar untuk ID user
      role: user.role.name, // Masukkan role ke dalam token
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
