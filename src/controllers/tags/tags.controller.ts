import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from 'src/services/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTag(@Body() tag: { title: string }, @Request() req) {
    const userId = req.user.userId;
    return await this.tagService.createTag(tag.title, userId);
  }

  @Get('tags_user')
  @UseGuards(AuthGuard('jwt'))
  async getTagsByUser(@Request() req) {
    const userId = req.user.userId;
    return await this.tagService.getTagsByUser(userId);
  }
}
