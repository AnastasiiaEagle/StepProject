import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { 
  RegisterDto, 
  LoginDto, 
  RegisterResponseDto, 
  LoginResponseDto, 
  ProfileResponseDto 
} from './dto/auth.dto';
import {
  RefreshTokenDto,
  RefreshResponseDto,
  LogoutResponseDto,
  LogoutAllResponseDto,
} from './dto/refresh.dto';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  // Ендпоінт для реєстрації нового користувача
  @Post('register')
  @ApiOperation({ 
    summary: 'Реєстрація нового користувача',
    description: 'Створює нового користувача та повертає пару токенів (access + refresh)'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Користувача успішно зареєстровано',
    type: RegisterResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Користувач з таким email або nickname вже існує' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Невірні дані (неправильний email, короткий пароль, тощо)' 
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Request() req?: any,
    @Res({ passthrough: true }) res?: any,
  ): Promise<RegisterResponseDto> {
    // Реєструємо користувача
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.nickname,
    );

    // Генеруємо пару токенів для нового користувача
    const tokens = await this.authService.generateTokenPair(
      user,
      req?.ip,
    );

    // Встановлюємо refresh токен як httpOnly cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true в production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    return {
      access_token: tokens.access_token,
      user: {
        id: user.id,
        email: user.email!,
        nickname: user.nickname!,
      },
      message: 'Користувача успішно зареєстровано!',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ 
    summary: 'Логін користувача',
    description: 'Автентифікує користувача за email та паролем та повертає пару токенів'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Успішний логін',
    type: LoginResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Невірні email або пароль' 
  })
  async login(
    @Request() req,
    @Res({ passthrough: true }) res?: any,
  ): Promise<LoginResponseDto> {
    const user = req.user;
    
    // Генеруємо пару токенів
    const tokens = await this.authService.generateTokenPair(
      user,
      req.ip,
    );

    // Встановлюємо refresh токен як httpOnly cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    return {
      access_token: tokens.access_token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    };
  }

  // Ендпоінт для оновлення access токена
  @Post('refresh')
  @ApiOperation({ 
    summary: 'Оновлення access токена',
    description: 'Оновлює access токен за допомогою refresh токена. Старий refresh токен видаляється, повертається новий.'
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Access токен успішно оновлено',
    type: RefreshResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Невірний або застарілий refresh токен' 
  })
  async refresh(
    @Request() req?: any,
    @Res({ passthrough: true }) res?: any,
  ): Promise<RefreshResponseDto> {
    // Отримуємо refresh токен з cookies
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh токен не знайдено');
    }

    // Перевіряємо refresh токен та отримуємо користувача
    const user = await this.authService.validateUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Невірний або застарілий refresh токен');
    }

    // Видаляємо старий refresh токен
    await this.authService.logout(refreshToken);

    // Генеруємо новий access токен
    const accessToken = await this.authService.generateJwt({
      userId: user.id,
      email: user.email!,
    });

    // Генеруємо новий refresh токен
    const newRefreshToken = await this.authService.generateTokenPair(
      user,
      req?.ip,
    );

    // Встановлюємо новий refresh токен як httpOnly cookie
    res.cookie('refresh_token', newRefreshToken.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    return {
      access_token: accessToken,
      expires_in: 15 * 60, // 15 хвилин в секундах
    };
  }

  // Ендпоінт для логауту
  @Post('logout')
  @ApiOperation({ 
    summary: 'Логаут користувача',
    description: 'Відкликає refresh токен поточного сеансу. Після цього токен стає недійсним.'
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Успішний логаут',
    type: LogoutResponseDto
  })
  async logout(@Request() req, @Res({ passthrough: true }) res?: any): Promise<LogoutResponseDto> {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    
    // Видаляємо cookie
    res.clearCookie('refresh_token');
    
    return { message: 'Успішний логаут' };
  }

  // Ендпоінт для логауту з усіх пристроїв
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Логаут з усіх пристроїв',
    description: 'Відкликає всі refresh токени користувача. Користувач буде розлогінений з усіх пристроїв.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Успішний логаут з усіх пристроїв',
    type: LogoutAllResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неавторизований доступ' 
  })
  async logoutAllDevices(@Request() req): Promise<LogoutAllResponseDto> {
    await this.authService.logoutAllDevices(req.user.userId);
    return { message: 'Успішний логаут з усіх пристроїв' };
  }

  // Захищений роут - потребує JWT токен
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth') // Показує що потрібен Bearer токен
  @ApiOperation({ 
    summary: 'Отримання профілю користувача',
    description: 'Повертає дані поточного авторизованого користувача'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Профіль користувача',
    type: ProfileResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неавторизований доступ' 
  })
  getProfile(@Request() req): ProfileResponseDto {
    return req.user;
  }

  // Тестовий захищений роут
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Тестовий захищений роут',
    description: 'Перевіряє чи працює JWT авторизація'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Повідомлення про успішний доступ',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Цей роут захищений JWT токеном!' 
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неавторизований доступ' 
  })
  getProtectedRoute() {
    return { message: 'Цей роут захищений JWT токеном!' };
  }
}
