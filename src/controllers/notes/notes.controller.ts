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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import { CreateNoteDTO } from 'src/DTO/createNote.dto';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import {
  PaginationFilterDTO,
  PaginationResultDTO,
} from 'src/DTO/pagination.dto';
import { UpdateNoteDTO } from 'src/DTO/udpateNote.dto';
import { NotesService } from 'src/services/notes/notes.service';

@ApiBearerAuth()
@Controller('notes')
@ApiTags('Notes')
@ApiExtraModels(PaginationFilterDTO)
@ApiExtraModels(PaginationResultDTO)
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
  @ApiParam({
    name: 'noteId',
    required: true,
    description: 'Note that will be restored to previous versions',
  })
  @ApiQuery({
    name: 'version',
    required: true,
    description: 'Version the note will be restored to',
  })
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
  @ApiQuery({
    name: 'title',
    required: false,
    description:
      'Title by wich the notes will be filtered (complete or incomplete title)',
  })
  @ApiQuery({
    name: 'content',
    required: false,
    description: 'Portion of content by which the notes will be filtered',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: [Number],
    description: 'Tags by which the notes will be filtered',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page number to fetch respective data',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit of data rows per page fetched',
  })
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
    @Body() body: UpdateNoteDTO,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.updateNote(id, body, userId);
  }

  @Put('archive/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async archiveNote(
    @Param('id') id: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.setArchiveStatus(id, true, userId);
  }

  @Put('dearchive/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async restoreNoteArchivation(
    @Param('id') id: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.noteService.setArchiveStatus(id, false, userId);
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
