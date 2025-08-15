import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersController } from 'src/controllers/filters/filters.controller';
import { Filters } from 'src/entities/filters/filters.entity';
import { FiltersService } from 'src/services/filters/filters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Filters])],
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [FiltersService],
})
export class FiltersModule {}
