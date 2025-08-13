import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from 'src/controllers/notes/notes.controller';
import { NoteEntity } from 'src/entities/note/note.entity';
import { NotesService } from 'src/services/notes/notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
