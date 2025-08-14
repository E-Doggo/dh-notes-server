import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { TagsService } from 'src/services/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTag(
    @Body() tag: { title: string },
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.tagService.createTag(tag.title, userId);
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getTagsByUser(@Request() req: { user: JWTUserDto }) {
    const userId: string = req.user.id;
    return await this.tagService.getTagsByUser(userId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTag(
    @Param('id') tagId: number,
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.tagService.deleteTag(tagId, userId);
  }
}
