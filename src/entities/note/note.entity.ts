import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TagEntity } from '../tags/tags.entity';

@Entity()
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  is_archived: boolean;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone' })
  deleted_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.notes, { onDelete: 'SET NULL' })
  user: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.notes, { cascade: true })
  @JoinTable()
  tags: TagEntity[];
}
