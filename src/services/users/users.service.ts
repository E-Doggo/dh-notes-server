import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { RegisterDTO } from 'src/DTO/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const salt = await genSalt(saltRounds);

    return await hash(password, salt);
  }

  async createUser(data: RegisterDTO): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    const user: User = this.repository.create({
      email: data.email,
      username: data.username,
      password_hash: hashedPassword,
    });
    return this.repository.save(user);
  }

  async getPassWordByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      where: { email: email },
      select: ['password_hash', 'id', 'username'],
    });
  }

  async findUserByID(id: number): Promise<User> {
    const result = await this.repository
      .createQueryBuilder('users')
      .select(['users.id', 'users.username', 'users.email', 'users.is_active'])
      .where('users.id = :id', { id })
      .getOne();

    return result;
  }
}
