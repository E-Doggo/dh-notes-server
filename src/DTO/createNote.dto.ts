import { IsString, IsArray, IsInt, MinLength } from 'class-validator';

export class CreateNoteDTO {
  @IsString() @MinLength(1) title: string;
  @IsString() content: string;
  @IsArray() @IsInt({ each: true }) tagIds: number[];
}
