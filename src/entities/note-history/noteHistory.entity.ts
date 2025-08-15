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

@Entity('note_history')
export class NoteHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToMany(() => Tag, (tag) => tag.notesHistory, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.notesHistory, { onDelete: 'SET NULL' })
  user: User;

  @Column({})
  @Generated('increment')
  version: number;
}
