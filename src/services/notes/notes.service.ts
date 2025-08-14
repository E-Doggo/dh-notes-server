import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { Note } from 'src/entities/note/note.entity';
import { In, Repository } from 'typeorm';
import { Tag } from 'src/entities/tags/tags.entity';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import { filter } from 'rxjs';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createNote(note: CreateNoteDTO, userId: string) {
    let tags: Tag[];

    if (Array.isArray(note.tagIds) && note.tagIds.length != 0) {
      tags = await this.tagRepository.find({
        where: {
          id: In(note.tagIds),
          user: { id: userId },
        },
      });
    }

    const noteObject: Note = this.noteRepository.create({
      title: note.title,
      content: note.content,
      tags: tags,
      user: { id: userId },
    });

    return await this.noteRepository.save(noteObject);
  }

  async getNotesByUser(
    userId: string,
    filters: BasicFiltersDTO,
  ): Promise<Note[]> {
    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .addSelect('notes')
      .innerJoinAndSelect('notes.tags', 'tags')
      .leftJoin('notes.user', 'user')
      .where('user.id = :id', { id: userId })
      .andWhere('notes.deleted_at IS NULL');

    if (filters.title != undefined) {
      queryBuilder.andWhere('LOWER(notes.title) LIKE LOWER(:title)', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.content != undefined) {
      queryBuilder.andWhere('LOWER(notes.content) LIKE LOWER(:content)', {
        content: `%${filters.content}%`,
      });
    }

    if (filters.tags != undefined && filters.tags.length !== 0) {
      queryBuilder
        .innerJoin('notes.tags', 'filterTags')
        .andWhere('filterTags.id IN (:...tags)', { tags: filters.tags });
    }

    const result = await queryBuilder.getMany();
    return result;
  }
}
