import { Tag } from 'src/entities/tags/tags.entity';
import { In, Repository } from 'typeorm';

export async function getTagsById(
  tagIds: number[],
  userId: string,
  repository: Repository<Tag>,
) {
  let tags: Tag[];

  if (Array.isArray(tagIds) && tagIds.length != 0) {
    tags = await repository.find({
      where: {
        id: In(tagIds),
        user: { id: userId },
      },
    });
  }

  return tags;
}
