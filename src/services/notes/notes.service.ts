import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { Note } from 'src/entities/note/note.entity';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Tag } from 'src/entities/tags/tags.entity';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import {
  PaginationFilterDTO,
  PaginationResultDTO,
} from 'src/DTO/pagination.dto';
import { offsetCalculator } from 'src/common/utils/pagCalculator';
import { FiltersService } from '../filters/filters.service';
import { NoteHistoryService } from '../note-history/note-history.service';
import { UpdateNoteDTO } from 'src/DTO/udpateNote.dto';
import { getTagsById } from 'src/common/utils/getTagIds';
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    private readonly filterService: FiltersService,

    private readonly historyService: NoteHistoryService,
  ) {}

  async findNote(id: number, userId: string) {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['tags'],
    });

    if (!note) {
      throw new HttpException(
        'Note not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    return note;
  }

  async createNote(note: CreateNoteDTO, userId: string) {
    const tags = await getTagsById(note.tagIds, userId, this.tagRepository);

    const noteObject: Note = this.noteRepository.create({
      title: note.title,
      content: note.content,
      tags: tags,
      user: { id: userId },
    });

    return await this.noteRepository.save(noteObject);
  }

  async restoreNoteVersion(noteId: number, version: number, userId: string) {
    const previousNote = await this.historyService.findNoteByVersion(
      noteId,
      version,
      userId,
    );
    if (!previousNote) {
      throw new HttpException(
        'Could not find specified version',
        HttpStatus.NOT_FOUND,
      );
    }

    const note = await this.noteRepository.findOne({
      where: { id: noteId, user: { id: userId } },
      relations: ['tags'],
    });

    if (!note) {
      throw new HttpException(
        'Original note not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.historyService.createNoteVersion(note, userId);

    note.title = previousNote.title;
    note.content = previousNote.content;
    note.tags = previousNote.tags;

    return await this.noteRepository.save(note);
  }

  async getNotesByUser(
    userId: string,
    filters: BasicFiltersDTO,
    paginationFilter: PaginationFilterDTO,
  ): Promise<PaginationResultDTO> {
    //calculate offset based on current page and limit.
    //e.g. if limit = 20 and page = 3 then offset = 40 by the formula (page - 1)* offset
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

    //Apply filters selected to queryBuilder
    this.applyFilters(queryBuilder, filters);
    queryBuilder.skip(offset).take(limit);

    //save the filters passed on query for future use
    await this.filterService.saveFilters(filters, userId);

    const [data, total] = await queryBuilder.getManyAndCount();

    const result: PaginationResultDTO = {
      data: data,
      total: total,
      limit: limit,
      page: page,
    };

    return result;
  }

  applyFilters(
    queryBuilder: SelectQueryBuilder<Note>,
    filters: BasicFiltersDTO,
  ) {
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

    return queryBuilder;
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

  async updateNote(id: number, body: UpdateNoteDTO, userId: string) {
    const note = await this.findNote(id, userId);

    if (!note) {
      throw new HttpException(
        'Note not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    const tags = await getTagsById(body.tagIds, userId, this.tagRepository);

    if (tags != undefined) {
      note.tags = note.tags.concat(tags);
    }

    await this.historyService.createNoteVersion(note, userId);

    const updatedNote = this.noteRepository.merge(note, body);

    const result = await this.noteRepository.save(updatedNote);

    return result;
  }

  async deleteNote(id: number, userId: string) {
    const note = await this.findNote(id, userId);

    if (!note) {
      throw new HttpException(
        'Note not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.noteRepository.softDelete({ id });
  }

  async setArchiveStatus(id: number, status: boolean, userId: string) {
    const note = await this.findNote(id, userId);
    if (!note) {
      throw new HttpException(
        'Note not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.noteRepository.update({ id }, { is_archived: status });
  }
}
