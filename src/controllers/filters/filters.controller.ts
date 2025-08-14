import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BasicFiltersDTO } from 'src/DTO/basicFilters.dto';
import { FiltersService } from 'src/services/filters/filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filterService: FiltersService) {}

  @Post('save')
  @UseGuards(AuthGuard('jwt'))
  async saveFilterStatus(@Body() filters: BasicFiltersDTO, @Request() req) {
    const userId = req.user.id;
    return await this.filterService.saveFilters(filters, userId);
  }
}
