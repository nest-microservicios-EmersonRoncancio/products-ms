import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber({}, { message: 'Skip must be a number' })
  @IsPositive({ message: 'Skip must be a positive number' })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsNumber({}, { message: 'Limit must be a number' })
  @IsPositive({ message: 'Limit must be a positive number' })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;
}
