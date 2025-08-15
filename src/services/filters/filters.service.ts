import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import { Filters } from 'src/entities/filters/filters.entity';
import { Tag } from 'src/entities/tags/tags.entity';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Filters)
    private readonly repositoryFilters: Repository<Filters>,
  ) {}

  async saveFilters(filters: BasicFiltersDTO, userId: string) {
    const exists = await this.findFilterByUser(userId);

    const filterObject = this.repositoryFilters.create({
      id: exists?.id,
      title: filters.title ?? null,
      content: filters.content ?? null,
      tags: filters.tags?.map((tagId) => ({ id: tagId }) as Tag) || [],
      user: { id: userId } as User,
    });

    return await this.repositoryFilters.save(filterObject);
  }

  async findFilterByUser(userId: string) {
    const result = await this.repositoryFilters
      .createQueryBuilder('filters')
      .select('filters')
      .leftJoin('filters.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.email'])
      .leftJoin('filters.tags', 'tags')
      .addSelect('tags.id')
      .where('user.id = :id', { id: userId })
      .getOne();

    return result;
  }
}
