import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { RegisterDTO } from 'src/DTO/register.dto';
import {
  PaginationFilterDTO,
  PaginationResultDTO,
} from 'src/DTO/pagination.dto';
import { offsetCalculator } from 'src/common/utils/pagCalculator';

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
    const result = await this.repository.findOne({
      where: { email: email },
      select: ['password_hash', 'id', 'username', 'role'],
    });
    if (!result) {
      throw new HttpException('Email not Found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findUserByID(id: string): Promise<User> {
    const result = await this.repository
      .createQueryBuilder('users')
      .select(['users.id', 'users.username', 'users.email', 'users.is_active'])
      .where('users.id = :id', { id })
      .getOne();

    if (!result) {
      throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async fetchAllUsers(
    paginationFilter: PaginationFilterDTO,
  ): Promise<PaginationResultDTO<User>> {
    const { page, limit, offset } = offsetCalculator(
      paginationFilter.page,
      paginationFilter.limit,
    );

    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .addSelect([
        'user.id',
        'user.email',
        'user.username',
        'user.is_active',
        'user.role',
      ]);

    console.log(page, limit, offset);

    queryBuilder.skip(offset).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();

    const result: PaginationResultDTO<User> = {
      data: data,
      total: total,
      limit: limit,
      page: page,
    };

    return result;
  }
}
