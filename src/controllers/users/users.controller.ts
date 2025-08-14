import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: { user: JWTUserDto }) {
    const userId: string = req.user.id;
    return await this.service.findUserByID(userId);
  }
}
