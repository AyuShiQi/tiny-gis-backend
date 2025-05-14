import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  globalObj: string;

  @Column('text')
  modelsArr: string;
}
