import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tags/tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(title: string, userId: string): Promise<Tag> {
    console.log(userId);

    const tag = this.tagRepository.create({
      title: title,
      user: { id: userId },
    });
    return await this.tagRepository.save(tag);
  }
}
