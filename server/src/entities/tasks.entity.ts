import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity("tasks")
export class Tasks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  description: string;

  @Column({ length: 100, default: 'pending' })
  status: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ length: 100 })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}