import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class BasicFiltersDTO {
  @IsString() @IsOptional() title: string | undefined | null;
  @IsArray() @IsInt({ each: true }) @IsOptional() tags: number[] | undefined;
  @IsString() @IsOptional() content: string | undefined;
}
