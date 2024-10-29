import { IsNumber } from 'class-validator';

export class PaginatedDto {
  @IsNumber()
  skip?: number = 0;

  @IsNumber()
  take?: number = 10;
}
