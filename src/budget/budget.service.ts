import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: any) {
    const budget = await this.prisma.budget.create({
      data: {
        idUser: userId,
        idCategory: data.idCategory ?? null,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        amount: data.amount,
      } as any,
    });
    return budget;
  }

  async findAllByUser(userId: number) {
    return this.prisma.budget.findMany({ where: { idUser: userId }, orderBy: { periodStart: 'desc' } });
  }

  async findById(id: number) {
    const bud = await this.prisma.budget.findUnique({ where: { idBudget: id } });
    if (!bud) throw new NotFoundException('Budget not found');
    return bud;
  }

  async update(userId: number, id: number, data: any) {
    const bud = await this.findById(id);
    if (bud.idUser !== userId) throw new ForbiddenException('Not allowed');

    const updated = await this.prisma.budget.update({
      where: { idBudget: id },
      data: {
        idCategory: data.idCategory ?? (bud as any).idCategory,
        periodStart: data.periodStart ? new Date(data.periodStart) : (bud as any).periodStart,
        periodEnd: data.periodEnd ? new Date(data.periodEnd) : (bud as any).periodEnd,
        amount: data.amount ?? (bud as any).amount,
      } as any,
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const bud = await this.findById(id);
    if (bud.idUser !== userId) throw new ForbiddenException('Not allowed');
    await this.prisma.budget.delete({ where: { idBudget: id } });
    return { message: 'Budget deleted' };
  }

  // Sum expenses for the budget period and category
  async getUsage(userId: number, id: number) {
    const bud = await this.findById(id);
    if (bud.idUser !== userId) throw new ForbiddenException('Not allowed');

    const where: any = {
      idUser: userId,
      date: { gte: bud.periodStart, lte: bud.periodEnd },
      // assume 'expense' transactions should be considered for budget usage
      type: 'expense',
    };

    if ((bud as any).idCategory) where.idCategory = (bud as any).idCategory;

    const agg = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where,
    });

    const used = agg._sum.amount ? Number(agg._sum.amount) : 0;
    const total = Number((bud as any).amount);
    return { used, total, percent: total > 0 ? (used / total) * 100 : 0 };
  }
}
