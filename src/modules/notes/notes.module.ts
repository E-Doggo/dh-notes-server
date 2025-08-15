import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from 'src/controllers/notes/notes.controller';
import { Note } from 'src/entities/note/note.entity';
import { Tag } from 'src/entities/tags/tags.entity';
import { NotesService } from 'src/services/notes/notes.service';
import { FiltersModule } from '../filters/filters.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Tag]), FiltersModule],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
