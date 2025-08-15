import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { PaginationFilterDTO } from 'src/DTO/pagination.dto';
import { UsersService } from 'src/services/users/users.service';

@ApiBearerAuth()
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin', 'user'])
  async getProfile(@Request() req: { user: JWTUserDto }) {
    const userId: string = req.user.id;
    return await this.service.findUserByID(userId);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['admin'])
  async getAllProfiles(
    @Request() req: { user: JWTUserDto },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userRole: string = req.user.role;
    console.log(userRole);

    const pagination: PaginationFilterDTO = { page, limit };
    return await this.service.fetchAllUsers(pagination);
  }
}
