import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/note/note.entity';
import { Tag } from 'src/entities/tags/tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
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

  async deleteTag(
    tagId: number,
    userId: string,
    replacementTag?: number,
  ): Promise<void> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId, user: { id: userId } },
      relations: ['notes'],
    });

    if (!tag) {
      throw new Error('Tag not found or not owned by user');
    }

    await this.noteRepository
      .createQueryBuilder()
      .relation('notes', 'tags')
      .of(tag.notes)
      .remove(tag.id);

    if (replacementTag != undefined) {
      await this.noteRepository
        .createQueryBuilder()
        .relation('notes', 'tags')
        .of(tag.notes)
        .add(replacementTag);
    }

    await this.tagRepository.delete(tagId);
  }
}
