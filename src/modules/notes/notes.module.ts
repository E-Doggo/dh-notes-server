import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from 'src/controllers/notes/notes.controller';
import { Note } from 'src/entities/note/note.entity';
import { NotesService } from 'src/services/notes/notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
