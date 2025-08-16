import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from 'src/controllers/tags/tags.controller';
import { Filters } from 'src/entities/filters/filters.entity';
import { NoteHistory } from 'src/entities/note-history/noteHistory.entity';
import { Note } from 'src/entities/note/note.entity';
import { Tag } from 'src/entities/tags/tags.entity';
import { TagsService } from 'src/services/tags/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Note, NoteHistory, Filters])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
