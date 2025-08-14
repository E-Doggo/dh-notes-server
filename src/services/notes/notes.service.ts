import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { Note } from 'src/entities/note/note.entity';
import { In, Repository } from 'typeorm';
import { Tag } from 'src/entities/tags/tags.entity';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import { filter } from 'rxjs';
import {
  PaginationFilterDTO,
  PaginationResultDTO,
} from 'src/DTO/pagination.dto';
import { offsetCalculator } from 'src/common/utils/pagCalculator';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findNote(id: number, userId: string) {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
    });

    return note;
  }

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
    paginationFilter: PaginationFilterDTO,
  ): Promise<PaginationResultDTO> {
    const { page, limit, offset } = offsetCalculator(
      paginationFilter.page,
      paginationFilter.limit,
    );

    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .addSelect('notes')
      .leftJoinAndSelect('notes.tags', 'tags')
      .leftJoin('notes.user', 'user')
      .where('user.id = :id', { id: userId })
      .andWhere('notes.deleted_at IS NULL');

    if (filters.title != undefined) {
      queryBuilder.andWhere('notes.title ILIKE :title', {
        title: `${filters.title}%`,
      });
    }

    if (filters.content != undefined) {
      queryBuilder.andWhere('notes.content ILIKE :content', {
        content: `${filters.content}%`,
      });
    }

    if (filters.tags != undefined && filters.tags.length !== 0) {
      queryBuilder
        .innerJoin('notes.tags', 'filterTags')
        .andWhere('filterTags.id IN (:...tags)', { tags: filters.tags });
    }

    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const result: PaginationResultDTO = {
      data: data,
      total: total,
      limit: limit,
      page: page,
    };

    return result;
  }

  async getSingleNote(id: number, userId: string) {
    const result = this.noteRepository
      .createQueryBuilder('notes')
      .addSelect('notes')
      .innerJoinAndSelect('notes.tags', 'tags')
      .leftJoin('notes.user', 'user')
      .where('user.id = :userId', { userId: userId })
      .andWhere('notes.id = :id', { id: id })
      .andWhere('notes.deleted_at IS NULL')
      .getOne();

    return result;
  }

  async updateNote(id: number, body: Partial<Note>, userId: string) {
    const note = await this.findNote(id, userId);

    if (!note) {
      throw new Error('Note not found or not owned by user');
    }

    const updatedNote = this.noteRepository.merge(note, body);

    return await this.noteRepository.save(updatedNote);
  }

  async deleteNote(id: number, userId: string) {
    const note = await this.findNote(id, userId);

    if (!note) {
      throw new Error('Note not found or not owned by user');
    }

    return await this.noteRepository.softDelete({ id });
  }

  async setArchiveStatus(id: number, status: boolean, userId: string) {
    const note = await this.findNote(id, userId);
    if (!note) {
      throw new Error('Note not found or not owned by user');
    }
    return await this.noteRepository.update({ id }, { is_archived: status });
  }
}
