import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshToken } from './refreshToken.entity';

@Entity('users')
export class User {
  @ApiProperty({ 
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'john.doe@example.com',
    uniqueItems: true
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string | null;

  @ApiProperty({ 
    description: 'User password',
    example: 'password123'
  })
  @Column({ type: 'varchar', length: 255 })
  password: string | null;



  @ApiProperty({ 
    description: 'User first name',
    example: 'John',
    maxLength: 100
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  nickname: string | null;

  @ApiProperty({ 
    description: 'User avatar',
    example: 'https://example.com/avatar.png'
  })
  @Column({ type: 'text', nullable: true })
  avatar: string | null;

  @ApiProperty({ 
    description: 'Date when user was created',
    example: '2023-01-01T00:00:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Date when user was last updated',
    example: '2023-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
} 