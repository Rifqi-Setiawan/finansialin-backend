import { IsInt, IsNumber, IsOptional, IsString, IsDateString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTransactionDto {
	@IsOptional()
	@IsInt()
	idCategory?: number;

	@IsOptional()
	@IsString()
	@IsIn(['income', 'expense'])
	type?: 'income' | 'expense';

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	amount?: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsDateString()
	date?: string;

	@IsOptional()
	@IsString()
	source?: string;
}
