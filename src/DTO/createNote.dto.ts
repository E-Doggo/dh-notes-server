import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, MinLength } from 'class-validator';

export class CreateNoteDTO {
  @ApiProperty({ description: 'title to assign to new note' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ description: 'content of the new note' })
  @IsString()
  content: string;

  @ApiProperty({
    type: [Number],
    description: 'List of existing tags to assign to the note',
  })
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];
}
