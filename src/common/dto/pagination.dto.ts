import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Max(1000)
  @Type(() => Number)
  limit?: number = 10;
}
