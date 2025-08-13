import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { Response } from 'express';
import { RegisterDTO } from 'src/DTO/register.dto';
import { LoginDTO } from 'src/DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    body.username = body.username.toLowerCase();
    return this.service.registerUser(body);
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    body.email = body.email.toLowerCase();
    const response = await this.service.login(body);
    return response.user;
  }

  @Post('logout')
  logout(@Res() res) {
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
