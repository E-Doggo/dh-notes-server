import { Test, TestingModule } from '@nestjs/testing';
import { NoteHistoryController } from './note-history.controller';

describe('NoteHistoryController', () => {
  let controller: NoteHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteHistoryController],
    }).compile();

    controller = module.get<NoteHistoryController>(NoteHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
