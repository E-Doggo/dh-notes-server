import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationFilterDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  limit: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number;
}

export class PaginationResultDTO<T> {
  @IsInt() page;
  @IsInt() limit;
  @IsInt() total;
  data: T[];
}
