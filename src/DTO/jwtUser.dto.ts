import { IsString } from 'class-validator';

export class JWTUserDto {
  @IsString() id: string;
  @IsString() username: string;
}
