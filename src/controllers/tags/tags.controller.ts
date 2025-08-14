import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from 'src/services/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTag(@Body() tag: { title: string }) {
    return await this.tagService.createTag(tag.title);
  }
}
