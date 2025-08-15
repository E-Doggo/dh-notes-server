import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteHistoryController } from 'src/controllers/note-history/note-history.controller';
import { NoteHistory } from 'src/entities/note-history/noteHistory.entity';
import { NoteHistoryService } from 'src/services/note-history/note-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([NoteHistory])],
  controllers: [NoteHistoryController],
  providers: [NoteHistoryService],
  exports: [NoteHistoryService],
})
export class NoteHistoryModule {}
