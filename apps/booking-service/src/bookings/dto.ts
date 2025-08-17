import { IsISO8601, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  providerId?: string; // only admins can set this explicitly

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsISO8601()
  startTime!: string; // ISO date

  @IsISO8601()
  endTime!: string; // ISO date
}

export class ListQueryDto {
  @IsOptional()
  @IsString()
  providerId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number = 20;
}
