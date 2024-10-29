import { IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from 'src/common/dtos/paginated.dto';

export class GetUsersDto extends PaginatedDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  birthDateGte?: string;

  @IsOptional()
  @IsString()
  birthDateLte?: string;
}
