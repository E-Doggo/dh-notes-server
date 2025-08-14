import { IsString } from 'class-validator';

export class RegisterDTO {
  @IsString() email: string;
  @IsString() username: string;
  @IsString() password: string;
}
