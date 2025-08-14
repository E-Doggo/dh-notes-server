import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from '../note/note.entity';
import { User } from '../user/user.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];

  @ManyToOne(() => User, (user) => user.tags)
  user: User;
}
