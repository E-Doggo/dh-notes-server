import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationFilterDTO {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  limit: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number;
}

export class PaginationResultDTO<T> {
  @ApiProperty()
  @IsInt()
  page;

  @ApiProperty()
  @IsInt()
  limit;

  @ApiProperty()
  @IsInt()
  total;

  @ApiProperty()
  data: T[];
}
