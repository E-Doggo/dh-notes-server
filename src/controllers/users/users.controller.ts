import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDTO } from 'src/DTO/login.dto';
import { UserEntity } from 'src/entities/user/user.entity';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
}
