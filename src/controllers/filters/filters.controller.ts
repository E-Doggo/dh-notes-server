import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { FiltersService } from 'src/services/filters/filters.service';

@ApiBearerAuth()
@Controller('filters')
@ApiTags('Filters')
export class FiltersController {
  constructor(private readonly filterService: FiltersService) {}

  @ApiOperation({
    summary: 'Fetches the filter settings for the logged user',
  })
  @Get('/fetch')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async getUserFilter(@Request() req) {
    const userId = req.user.id;
    return await this.filterService.findFilterByUser(userId);
  }
}
