import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { RegisterDTO } from 'src/DTO/register.dto';
import { LoginDTO } from 'src/DTO/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @Post('register')
  async register(@Body() body: RegisterDTO) {
    body.username = body.username.toLowerCase();
    return this.service.registerUser(body);
  }

  @ApiOperation({ summary: 'Login into an existing user profile' })
  @Post('login')
  async login(@Body() body: LoginDTO) {
    body.email = body.email.toLowerCase();
    const response = await this.service.login(body);
    return response;
  }

  @Post('logout')
  logout(@Res() res) {
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
