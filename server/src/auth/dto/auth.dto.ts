import { ApiProperty } from '@nestjs/swagger';

// DTO для реєстрації користувача
export class RegisterDto {
  @ApiProperty({
    description: 'Email адреса користувача',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача (мінімум 6 символів)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'Унікальний нікнейм користувача',
    example: 'user123',
    type: String,
    maxLength: 50,
  })
  nickname: string;
}

// DTO для логіну користувача
export class LoginDto {
  @ApiProperty({
    description: 'Email адреса користувача',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
    type: String,
  })
  password: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'JWT токен для авторизації',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'Дані користувача',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      email: { type: 'string', example: 'user@example.com' },
      nickname: { type: 'string', example: 'user123' },
    },
  })
  user: {
    id: string;
    email: string;
    nickname: string;
  };

  @ApiProperty({
    description: 'Повідомлення про успішну реєстрацію',
    example: 'Користувача успішно зареєстровано!',
    type: String,
  })
  message: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT токен для авторизації',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'Дані користувача',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      email: { type: 'string', example: 'user@example.com' },
      nickname: { type: 'string', example: 'user123' },
    },
  })
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'ID користувача',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'Email адреса користувача',
    example: 'user@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Нікнейм користувача',
    example: 'user123',
    type: String,
  })
  nickname: string;
} 