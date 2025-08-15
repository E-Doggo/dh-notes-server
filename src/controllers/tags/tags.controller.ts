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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { TagsService } from 'src/services/tags/tags.service';

@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @ApiOperation({
    summary: 'Creates tags for a user',
  })
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

  @ApiOperation({
    summary: 'Fetches the tags of the logged user',
  })
  @Get('fetch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async getTagsByUser(@Request() req: { user: JWTUserDto }) {
    const userId: string = req.user.id;
    return await this.tagService.getTagsByUser(userId);
  }

  @ApiOperation({
    summary: 'Deletes a given tag',
    description:
      'the deletion will only be done if the user owns said tag, once deleted the tag will be deleted from its corresponding note',
  })
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
