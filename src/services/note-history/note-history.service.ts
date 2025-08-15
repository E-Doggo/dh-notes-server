import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteHistory } from 'src/entities/note-history/noteHistory.entity';
import { Note } from 'src/entities/note/note.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoteHistoryService {
  constructor(
    @InjectRepository(NoteHistory)
    private readonly historyRepository: Repository<NoteHistory>,
  ) {}

  async createNoteVersion(originalNote: Note, userId: string) {
    //calculate new version based on original note and current Version
    //note history where original_note.id = 10 and version = 4 will return nextVersion = 5
    //and note history where original_note.id = 12 and version = 2 will return nextVersion = 3
    //avoiding versioning issues
    const lastVersion = await this.historyRepository
      .createQueryBuilder('history')
      .select('MAX(history.version)', 'max')
      .where('history.original_note = :noteId', { noteId: originalNote.id })
      .getRawOne();
    const nextVersion = (lastVersion?.max || 0) + 1;

    const object = this.historyRepository.create({
      title: originalNote.title,
      content: originalNote.content,
      original_note: { id: originalNote.id },
      tags: originalNote.tags,
      user: { id: userId },
      version: nextVersion,
    });

    const result = await this.historyRepository.save(object);

    return result;
  }

  async findNoteByVersion(noteId: number, version: number, userId: string) {
    const note = this.historyRepository
      .createQueryBuilder('note_history')
      .addSelect('note_history')
      .leftJoinAndSelect('note_history.tags', 'tags')
      .leftJoin('note_history.user', 'user')
      .leftJoin('note_history.original_note', 'original_note')
      .where('note_history.version = :version', { version })
      .andWhere('original_note.id = :noteId', { noteId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return note;
  }
}
