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
  ApiOperation,
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

  @ApiOperation({
    summary: 'Creates a Note for the logged user',
  })
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

  @ApiOperation({
    summary: 'Restores note to previous version',
    description:
      'The Database saves each previous note state by its original note id and its current version.',
  })
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

  @ApiOperation({
    summary: 'Retrieves the notes for a user',
    description:
      'The selection of a filter in the queries will trigger the Filter service to save (or update) the current user filter settings',
  })
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

  @ApiOperation({
    summary: 'Fetches a single note based on the id passed on the URL',
  })
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

  @ApiOperation({
    summary:
      'Updates a note based on the Id given on the URL and the Body data',
    description:
      'The data present on the body can be partial as the ORM will udpate only the attributes found in it. \n\n The update of a note will trigger the save of a new row, in the note history table, with the data of the note previous to the save.',
  })
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

  @ApiOperation({
    summary: 'Archives a note based on Id given on the URL',
  })
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

  @ApiOperation({
    summary: 'Dearchives a note based on Id given on the URL',
  })
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

  @ApiOperation({
    summary: 'Deletes a note based on Id given on the URL',
    description:
      'The deletion on the database is controlled with a softdeletion (deleted_at timestamp attribute) to avoid data loss that may be used for statistic or audits',
  })
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
  @ApiOperation({
    summary: 'Retrieves all notes if the request was made by an admin',
  })
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
