import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

import { PaginationDto } from "./pagination";
import { TypeRentals } from "../enums/type-rental.enum";

export class RentalsFilterDto extends PaginationDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number; // se usará para filtrar price >= minPrice

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number; // se usará para filtrar price <= maxPrice

  @IsOptional()
  @IsEnum(TypeRentals)
  TypeRental?: TypeRentals; // coincide con la entidad

  @IsOptional()
  sortBy?: 'price' | 'createdAt' | 'available' | 'TypeRental';

  @IsOptional()
  order?: 'ASC' | 'DESC';
}



