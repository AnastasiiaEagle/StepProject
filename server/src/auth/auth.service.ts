import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entities/user.entity';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenService: TokenService,
  ) {}

  // Реєструє нового користувача
  async register(email: string, password: string, nickname: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const existingNickname = await this.userRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new ConflictException('Користувач з таким nickname вже існує');
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });

    const savedUser = await this.userRepository.save(newUser);

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  // Генерує JWT токен для користувача
  async generateJwt(payload: { userId: string; email: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  // Генерує пару токенів (access + refresh)
  async generateTokenPair(user: User, ipAddress?: string) {
    const accessToken = await this.generateJwt({
      userId: user.id,
      email: user.email!,
    });

    // Створюємо та зберігаємо refresh токен
    const refreshTokenEntity = await this.tokenService.createRefreshToken(
      user,
      ipAddress,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshTokenEntity.refreshToken,
      expires_in: 15 * 60, // 15 хвилин в секундах
    };
  }

  // Оновлює access токен за допомогою refresh токена
  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
    // Перевіряємо refresh токен
    const user = await this.tokenService.validateRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Невірний або застарілий refresh токен');
    }

    // Видаляємо використаний refresh токен (безпека)
    await this.tokenService.revokeRefreshToken(refreshToken);

    // Генеруємо новий access токен
    const accessToken = await this.generateJwt({
      userId: user.id,
      email: user.email!,
    });

    return {
      access_token: accessToken,
      expires_in: 15 * 60, // 15 хвилин в секундах
    };
  }

  // Логаут користувача
  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  // Логаут з усіх пристроїв (відкликає всі refresh токени користувача)
  async logoutAllDevices(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  // Перевіряє refresh токен та повертає користувача
  async validateUserByRefreshToken(refreshToken: string): Promise<User | null> {
    return await this.tokenService.validateRefreshToken(refreshToken);
  }

  // Перевіряє email та пароль користувача
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const isPasswordValid = await argon2.verify(user.password!, password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }


}
