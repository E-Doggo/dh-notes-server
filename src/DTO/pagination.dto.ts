import { ApiProperty } from '@nestjs/swagger';
import { execFile } from 'child_process';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationFilterDTO {
  @ApiProperty({
    required: false,
    description: 'limit of data rows per page',
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  limit: number;

  @ApiProperty({
    required: false,
    description: 'page selected to fetch data',
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number;
}

export class PaginationResultDTO<T> {
  @ApiProperty({ type: Number, description: 'Current page' })
  @IsInt()
  page;

  @ApiProperty({ type: Number, description: 'Current page data row limit' })
  @IsInt()
  limit;

  @ApiProperty({
    type: Number,
    description: 'total data rows found on the Database',
  })
  @IsInt()
  total;

  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    description: 'Retrieved data',
  })
  data: T[];
}
