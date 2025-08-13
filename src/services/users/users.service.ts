import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { RegisterDTO } from 'src/DTO/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const salt = await genSalt(saltRounds);

    return await hash(password, salt);
  }

  async createUser(data: RegisterDTO): Promise<UserEntity> {
    const hashedPassword = await this.hashPassword(data.password);
    const user: UserEntity = this.repository.create({
      email: data.email,
      username: data.username,
      password_hash: hashedPassword,
    });
    return this.repository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.repository.findOneBy({ email: email });
  }

  async findUserByID(id: number): Promise<UserEntity> {
    return await this.repository.findOne({ where: { id: id } });
  }
}
