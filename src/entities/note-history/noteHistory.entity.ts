import {
  Column,
  Entity,
  Generated,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tag } from '../tags/tags.entity';
import { User } from '../user/user.entity';
import { Note } from '../note/note.entity';

@Entity('note_history')
@Unique(['original_note', 'version']) //avoids having a repeated note and version
export class NoteHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Index()
  @ManyToOne(() => Note, (note) => note.versions, { onDelete: 'SET NULL' })
  original_note: Note;

  @ManyToMany(() => Tag, (tag) => tag.notesHistory, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @Index()
  @ManyToOne(() => User, (user) => user.notesHistory, { onDelete: 'SET NULL' })
  user: User;

  @Column()
  version: number;
}
