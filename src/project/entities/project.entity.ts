import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  coordinates: string;

  @Column('float')
  radius: number;

  @Column()
  layers: number;

  @Column('text')
  modelsArr: string;

  @Column('text')
  globalObj: string;

  @Column()
  mode: number;

  @Column({ nullable: true })
  templateId?: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ default: '' })
  url: string;
}
