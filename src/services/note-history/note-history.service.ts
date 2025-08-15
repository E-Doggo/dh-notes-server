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
    const object = this.historyRepository.create({
      title: originalNote.title,
      content: originalNote.content,
      original_note: { id: originalNote.id },
      tags: originalNote.tags,
      user: { id: userId },
    });

    const result = await this.historyRepository.save(object);

    return result;
  }
}
