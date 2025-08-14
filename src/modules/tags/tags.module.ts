import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from 'src/controllers/tags/tags.controller';
import { Note } from 'src/entities/note/note.entity';
import { Tag } from 'src/entities/tags/tags.entity';
import { TagsService } from 'src/services/tags/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Note])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
