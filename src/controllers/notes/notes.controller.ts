import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { PaginationFilterDTO } from 'src/DTO/pagination.dto';
import { Note } from 'src/entities/note/note.entity';
import { NotesService } from 'src/services/notes/notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async createNote(
    @Body() note: CreateNoteDTO,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;

    return await this.noteService.createNote(note, userId);
  }

  @Post('restore/:noteId/')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async restoreNoteVersion(
    @Param('noteId') noteId: number,
    @Query('version') version: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;

    if (version == undefined) {
      throw new HttpException(
        'Version cannot be undefined',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.noteService.restoreNoteVersion(noteId, version, userId);
  }

  @Get('fetch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async getNotesByUser(
    @Request() req: { user: JWTUserDto },
    @Query('title') title?: string,
    @Query('content') content?: string,
    @Query(
      'tags',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    tags?: number[],
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId: string = req.user.id;

    const filters: BasicFiltersDTO = {
      title: title,
      content: content,
      tags: tags,
    };

    const pagination: PaginationFilterDTO = {
      page: page,
      limit: limit,
    };

    return await this.noteService.getNotes(userId, filters, pagination);
  }

  @Get('fetch/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async getSingleNote(
    @Param('id') id: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;

    return await this.noteService.getSingleNote(id, userId);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async updateNote(
    @Param('id') id: number,
    @Body() body: Partial<Note>,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.updateNote(id, body, userId);
  }

  @Put('archive/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async setArchiveStatus(
    @Param('id') id: number,
    @Body('archived') archived: boolean,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.setArchiveStatus(id, archived, userId);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async deleteNote(
    @Param('id') id: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.deleteNote(id, userId);
  }

  //Admin only requests
  @Get('admin/fetch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin'])
  async getAllNotes(
    @Request() req: { user: JWTUserDto },
    @Query('title') title?: string,
    @Query('content') content?: string,
    @Query(
      'tags',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    tags?: number[],
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId: string = req.user.id;
    const userRole: string = req.user.role;

    const filters: BasicFiltersDTO = {
      title: title,
      content: content,
      tags: tags,
    };

    const pagination: PaginationFilterDTO = {
      page: page,
      limit: limit,
    };

    return await this.noteService.getNotes(
      userId,
      filters,
      pagination,
      userRole,
    );
  }
}
