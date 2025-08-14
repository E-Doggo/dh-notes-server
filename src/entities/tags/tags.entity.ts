import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Note } from '../note/note.entity';
import { User } from '../user/user.entity';
import { title } from 'process';

@Entity('tags')
@Unique(['user', 'title'])
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'SET NULL' })
  user: User;
}
