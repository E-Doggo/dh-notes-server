import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../tags/tags.entity';
import { User } from '../user/user.entity';
import { Note } from '../note/note.entity';

@Entity('note_history')
export class NoteHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Note, (note) => note.versions, { onDelete: 'SET NULL' })
  original_note: Note;

  @ManyToMany(() => Tag, (tag) => tag.notesHistory, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.notesHistory, { onDelete: 'SET NULL' })
  user: User;

  @Column()
  version: number;
}
