import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users') // This will be the table name in database
export class User {
  @ApiProperty({ 
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'User first name',
    example: 'John',
    maxLength: 100
  })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ 
    description: 'User last name',
    example: 'Doe',
    maxLength: 100
  })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'john.doe@example.com',
    uniqueItems: true
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'password123'
  })
  @Column()
  password: string;

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
} 