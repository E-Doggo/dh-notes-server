import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../tags/tags.entity';
import { User } from '../user/user.entity';

@Entity('filters')
export class Filters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  title?: string;

  @Column({ nullable: true, default: null })
  content?: string;

  @OneToOne(() => User, (user) => user.filters, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.filters, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  tags?: Tag[];
}
