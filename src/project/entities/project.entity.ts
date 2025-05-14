import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  title: string;

  @Column('text')
  coordinates: string;

  @Column('float')
  radius: number;

  @Column({ default: false })
  layers: boolean;

  @Column('text')
  modelsArr: string;

  @Column('text')
  globalObj: string;

  @Column()
  mode: number;

  @Column({ nullable: true })
  templateId?: string;

  @ManyToOne(() => User, user => user.projects)
  user: User;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ default: '' })
  url: string;
}
