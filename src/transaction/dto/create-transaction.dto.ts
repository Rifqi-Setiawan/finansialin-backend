import { IsInt, IsNumber, IsOptional, IsString, IsDateString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsOptional()
  @IsInt()
  idCategory?: number;

  @IsString()
  @IsIn(['income', 'expense'])
  type!: 'income' | 'expense'; // 'income' | 'expense'

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  source?: string;
}
