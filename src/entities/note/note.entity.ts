import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Tag } from '../tags/tags.entity';
import { NoteHistory } from '../note-history/noteHistory.entity';

@Entity('notes')
@Index(['user', 'is_archived'])
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  is_archived: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone' })
  deleted_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'SET NULL' })
  user: User;

  @OneToMany(() => NoteHistory, (history) => history.original_note)
  versions: NoteHistory[];

  @ManyToMany(() => Tag, (tag) => tag.notes, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];
}
