import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tags/tags.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(title: string, userId: string): Promise<Tag> {
    const tag = this.tagRepository.create({
      title: title,
      user: { id: userId },
    });
    return await this.tagRepository.save(tag);
  }

  async getTagsByUser(userId: string): Promise<Tag[]> {
    const result = await this.tagRepository
      .createQueryBuilder('tags')
      .addSelect('tags')
      .where('tags.user.id = :id', { id: userId })
      .getMany();

    return result;
  }

  async deleteTag(tagId: number, userId: string): Promise<DeleteResult> {
    const result = await this.tagRepository
      .createQueryBuilder('tags')
      .delete()
      .from('tags')
      .where('id = :tagId AND user.id = :userId', { tagId, userId })
      .execute();

    return result;
  }
}
