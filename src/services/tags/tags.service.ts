import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filters } from 'src/entities/filters/filters.entity';
import { NoteHistory } from 'src/entities/note-history/noteHistory.entity';
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
    @InjectRepository(NoteHistory)
    private readonly noteHistoryRepository: Repository<NoteHistory>,
    @InjectRepository(Filters)
    private readonly filtersRepository: Repository<NoteHistory>,
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
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    //removes tag from notes_tag junction table
    await this.noteRepository
      .createQueryBuilder()
      .relation(Note, 'tags')
      .of(tag.notes.map((note) => note.id))
      .remove(tag);

    if (replacementTag !== undefined && replacementTag !== null) {
      const replacementId = Number(replacementTag);

      if (Number.isInteger(replacementId) && replacementId > 0) {
        await this.noteRepository
          .createQueryBuilder()
          .relation(Note, 'tags')
          .of(tag.notes.map((note) => note.id))
          .add(replacementId);
      } else {
        console.log('ReplacementTag inválido, se ignora:', replacementTag);
      }
    }

    //removes respective tag row from tags table
    await this.tagRepository.remove(tag);
  }
}
