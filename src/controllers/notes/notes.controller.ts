import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { Note } from 'src/entities/note/note.entity';
import { NotesService } from 'src/services/notes/notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createNote(
    @Body() note: CreateNoteDTO,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;

    return await this.noteService.createNote(note, userId);
  }
}
