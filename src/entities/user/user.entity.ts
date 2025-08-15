import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Note } from '../note/note.entity';
import { Tag } from '../tags/tags.entity';
import { Filters } from '../filters/filters.entity';
import { NoteHistory } from '../note-history/noteHistory.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  username: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => NoteHistory, (note) => note.user)
  notesHistory: NoteHistory[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToOne(() => Filters, (filters) => filters.user)
  filters: Filters;
}
