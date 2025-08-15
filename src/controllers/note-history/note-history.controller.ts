import { Controller } from '@nestjs/common';
import { NoteHistoryService } from 'src/services/note-history/note-history.service';

@Controller('note-history')
export class NoteHistoryController {
  constructor(private readonly historyService: NoteHistoryService) {}
}
