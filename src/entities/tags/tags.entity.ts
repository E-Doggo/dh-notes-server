import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Note } from '../note/note.entity';
import { User } from '../user/user.entity';
import { Filters } from '../filters/filters.entity';
import { NoteHistory } from '../note-history/noteHistory.entity';

@Entity('tags')
@Unique(['user', 'title'])
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];

  @ManyToMany(() => NoteHistory, (note) => note.tags)
  notesHistory: NoteHistory[];

  @Index()
  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'SET NULL' })
  user: User;

  @ManyToMany(() => Filters, (filters) => filters.tags)
  filters: Filters[];
}
