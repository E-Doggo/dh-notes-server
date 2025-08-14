import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
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

  @Get('fetch')
  @UseGuards(AuthGuard('jwt'))
  async getNotesByUser(
    @Request() req: { user: JWTUserDto },
    @Query('title') title?: string,
    @Query('content') content?: string,
    @Query(
      'tags',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    tags?: number[],
  ) {
    const userId: string = req.user.id;

    const filters: BasicFiltersDTO = {
      title: title,
      content: content,
      tags: tags,
    };

    return await this.noteService.getNotesByUser(userId, filters);
  }

  @Get('fetch/:id')
  @UseGuards(AuthGuard('jwt'))
  async getSingleNote(
    @Param('id') id: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;

    return await this.noteService.getSingleNote(id, userId);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateNote(
    @Param('id') id: number,
    @Body() body: Partial<Note>,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.updateNote(id, body, userId);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteNote(
    @Param('id') id: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.deleteNote(id, userId);
  }
}
