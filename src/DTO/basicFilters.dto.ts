import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class BasicFiltersDTO {
  @ApiProperty({ required: false, description: 'Title of a note to search to' })
  @IsString()
  @IsOptional()
  title: string | undefined | null;

  @ApiProperty({
    required: false,
    description: 'IDs of Tags to search note to',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags: number[] | undefined;

  @ApiProperty({
    required: false,
    description: 'content of a note to search to',
  })
  @IsString()
  @IsOptional()
  content: string | undefined;
}
