import { Body, Controller, Post } from '@nestjs/common';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { Note } from 'src/entities/note/note.entity';
import { NotesService } from 'src/services/notes/notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Post()
  async createNote(@Body() note: CreateNoteDTO) {
    return await this.noteService.createNote(note);
  }
}
