import {
  IsString,
  IsArray,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateNoteDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_archived?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}
