import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  userId: number;

  @Column('text')
  detail: string; // 保存 JSON 字符串或文件内容

  @Column({ default: 'json' }) // 或者 'gltf'
  type: 'json' | 'gltf';

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
