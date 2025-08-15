import { Test, TestingModule } from '@nestjs/testing';
import { NoteHistoryService } from './note-history.service';

describe('NoteHistoryService', () => {
  let service: NoteHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteHistoryService],
    }).compile();

    service = module.get<NoteHistoryService>(NoteHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
