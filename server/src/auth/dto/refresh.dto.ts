import { ApiProperty } from '@nestjs/swagger';

// DTO для запиту refresh токена
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh токен для оновлення access токена',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    type: String,
    minLength: 64,
    maxLength: 128,
  })
  refresh_token: string;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Новий JWT access токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMCIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYzNTU5NzIwMCwiZXhwIjoxNjM1NTk4MTAwfQ.example',
    type: String,
  })
  access_token: string;



  @ApiProperty({
    description: 'Час життя access токена в секундах',
    example: 900,
    type: Number,
  })
  expires_in: number;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішний логаут',
    example: 'Успішний логаут',
    type: String,
  })
  message: string;
}

export class LogoutAllResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішний логаут з усіх пристроїв',
    example: 'Успішний логаут з усіх пристроїв',
    type: String,
  })
  message: string;
} 