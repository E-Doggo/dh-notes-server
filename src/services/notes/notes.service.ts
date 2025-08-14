import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { Note } from 'src/entities/note/note.entity';
import { In, Repository } from 'typeorm';
import { Tag } from 'src/entities/tags/tags.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createNote(note: CreateNoteDTO, userId: string) {
    if (!Array.isArray(note.tagIds) || note.tagIds.length === 0) {
      throw new Error('tagIds must be a non-empty array');
    }

    const tags = await this.tagRepository.find({
      where: {
        id: In(note.tagIds),
        user: { id: userId },
      },
    });

    const noteObject: Note = this.noteRepository.create({
      title: note.title,
      content: note.content,
      tags: tags,
      user: { id: userId },
    });

    return await this.noteRepository.save(noteObject);
  }

  async getNotesByUser(userId: string): Promise<Note[]> {
    const result = await this.noteRepository
      .createQueryBuilder('notes')
      .addSelect([
        'notes.title',
        'notes.content',
        'notes.created_at',
        'notes.updated_at',
      ])
      .where('notes.user.id = :id', { id: userId })
      .andWhere('notes.deleted_at IS NULL')
      .getMany();

    return result;
  }
}
