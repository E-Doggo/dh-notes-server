import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    description: 'Email that will be linked to the user profile',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({ description: 'User displayname', required: true })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password that will be encrypted when saved to the Database',
    required: true,
  })
  @IsString()
  password: string;
}
