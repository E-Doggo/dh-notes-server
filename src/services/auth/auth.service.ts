import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user/user.entity';
import { RegisterDTO } from 'src/DTO/register.dto';
import { compare } from 'bcrypt';
import { LoginDTO } from 'src/DTO/login.dto';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async registerUser(data: RegisterDTO) {
    try {
      const result = await this.userService.createUser(data);

      if (!result) {
        throw new HttpException(
          'User could not be created',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User registered successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Unexpected error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByID(id: string) {
    const user = await this.userService.findUserByID(id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async validateUser(data: LoginDTO): Promise<JWTUserDto> {
    const user: User = await this.userService.getPassWordByEmail(data.email);

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = await compare(
      data.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
    }

    const payload: JWTUserDto = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return payload;
  }

  async login(data: LoginDTO) {
    const user: JWTUserDto = await this.validateUser(data);

    const payload = { username: user.username, sub: user.id, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, username: user.username },
    };
  }
}
