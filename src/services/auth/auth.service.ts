import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user/user.entity';
import { RegisterDTO } from 'src/DTO/register.dto';
import { compare } from 'bcrypt';
import { LoginDTO } from 'src/DTO/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async registerUser(data: RegisterDTO) {
    await this.userService.createUser(data);
  }

  async findUserByID(id: number) {
    return await this.userService.findUserByID(id);
  }

  async validateUser(
    data: LoginDTO,
  ): Promise<{ id: number; username: string }> {
    const user: User = await this.userService.getPassWordByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid: boolean = await compare(
      data.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return { id: user.id, username: user.username };
  }

  async login(data: LoginDTO) {
    const user = await this.validateUser(data);

    const payload = { username: user.username, sub: user.id };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, username: user.username },
    };
  }
}
