import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from 'src/controllers/tags/tags.controller';
import { TagEntity } from 'src/entities/tags/tags.entity';
import { TagsService } from 'src/services/tags/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
