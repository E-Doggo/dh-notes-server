import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { TagsService } from 'src/services/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async createTag(
    @Body() tag: { title: string },
    @Request() req: { user: JWTUserDto },
  ) {
    const userId: string = req.user.id;
    return await this.tagService.createTag(tag.title, userId);
  }

  @Get('fetch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async getTagsByUser(@Request() req: { user: JWTUserDto }) {
    const userId: string = req.user.id;
    return await this.tagService.getTagsByUser(userId);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async deleteTag(
    @Param('id') tagId: number,
    @Request() req: { user: JWTUserDto },
    @Query('replacementTag') replacementTag?: number,
  ) {
    const userId: string = req.user.id;
    return await this.tagService.deleteTag(tagId, userId, replacementTag);
  }
}
