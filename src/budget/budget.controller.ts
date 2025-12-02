import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete, Query, BadRequestException } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateBudgetDto) {
    return this.budgetService.create(user.idUser, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.budgetService.findAllByUser(user.idUser);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    const bud = await this.budgetService.findById(id);
    if (bud.idUser !== user.idUser) return { error: 'Not allowed' };
    return bud;
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBudgetDto) {
    return this.budgetService.update(user.idUser, id, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.remove(user.idUser, id);
  }

  @Get(':id/usage')
  async usage(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.getUsage(user.idUser, id);
  }

  /**
   * GET /budgets/goals?period=monthly&date=2025-11-01&type=expense&idCategory=1
   */
  @Get('goals')
  async goals(
    @CurrentUser() user: any,
    @Query('period') period: string,
    @Query('date') date: string,
    @Query('type') type: string,
    @Query('idCategory') idCategory?: string,
  ) {
    if (!period) throw new BadRequestException('period is required (daily|weekly|monthly|year)');
    const txType = type || 'expense';
    const catId = idCategory ? parseInt(idCategory, 10) : undefined;
    try {
      return this.budgetService.getGoals(user.idUser, period, date, txType, catId);
    } catch (err: any) {
      throw new BadRequestException(err?.message || 'Invalid request');
    }
  }
}
