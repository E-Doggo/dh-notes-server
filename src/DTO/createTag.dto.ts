import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Title of the tag',
    example: 'Important',
  })
  @IsString()
  @MinLength(1)
  title: string;
}
