import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationFilterDTO {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  //   @Min(1)
  limit: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  //   @Min(1)
  page: number;
}

export class PaginationResultDTO {
  @IsInt() page;
  @IsInt() limit;
  @IsInt() total;
  data: any[];
}
