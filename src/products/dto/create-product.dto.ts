import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Type(() => Number)
  price: number;

  // @IsBoolean()
  // active: boolean;
}
