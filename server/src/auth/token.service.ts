import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';
import { User } from '../entities/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Генерує унікальний refresh токен
  private generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  // Створює або оновлює refresh токен для користувача
  async createRefreshToken(
    user: User,
    ipAddress?: string,
  ): Promise<RefreshToken> {
    const refreshToken = this.generateRefreshToken();

    // Встановлюємо термін дії токена (7 днів)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Спочатку видаляємо старі токени для цього користувача (якщо існують)
    await this.refreshTokenRepository.delete({
      user: { id: user.id },
    });

    const newRefreshToken = this.refreshTokenRepository.create({
      refreshToken,
      user,
      expiresAt,
      ipAddress,
    });

    return await this.refreshTokenRepository.save(newRefreshToken);
  }

  // Знаходить refresh токен по хешу
  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { refreshToken: tokenHash },
      relations: ['user'],
    });
  }

  // Перевіряє чи refresh токен валідний
  async validateRefreshToken(tokenHash: string): Promise<User | null> {
    const refreshToken = await this.findRefreshToken(tokenHash);

    if (!refreshToken) {
      return null;
    }

    if (refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.user;
  }

  // Видаляє refresh токен (використовується при логауті)
  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await this.refreshTokenRepository.delete({ refreshToken: tokenHash });
  }

  // Видаляє всі refresh токени користувача
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  // Видаляє застарілі токени (можна викликати кроном)
  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }

  // Отримує всі активні токени користувача
  async getUserActiveTokens(userId: string): Promise<RefreshToken[]> {
    return await this.refreshTokenRepository.find({
      where: {
        user: { id: userId },
        expiresAt: { $gt: new Date() } as any,
      },
      relations: ['user'],
    });
  }

  // Отримує кількість активних токенів користувача
  async getUserActiveTokensCount(userId: string): Promise<number> {
    return await this.refreshTokenRepository.count({
      where: {
        user: { id: userId },
        expiresAt: { $gt: new Date() } as any,
      },
    });
  }
} 