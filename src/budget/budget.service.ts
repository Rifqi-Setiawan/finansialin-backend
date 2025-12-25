import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService, NotificationType } from '../notification/notification.service';

@Injectable()
export class BudgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

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
    
    // Create notification
    const message = `Budget baru sebesar Rp${budget.amount} telah dibuat untuk periode ${new Date(budget.periodStart).toLocaleDateString()} - ${new Date(budget.periodEnd).toLocaleDateString()}.`;
    await this.notificationService.create(userId, NotificationType.BUDGET_CREATED, message);
    
    return budget;
  }

  /**
   * Get budget goals summary per category for a given period.
   * period: 'daily'|'weekly'|'monthly'|'year'
   * date: ISO date string representing any day within the requested period (e.g. '2025-11-25')
   * txType: 'expense'|'income'|'both' (default: 'expense')
   * optional idCategory to filter a single category
   */
  async getGoals(userId: number, period: string, dateStr: string, txType = 'expense', idCategory?: number) {
    const date = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(date.getTime())) throw new Error('Invalid date');

    let start: Date;
    let end: Date;
    switch (period) {
      case 'daily':
        start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
        end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0));
        break;
      case 'weekly': {
        // week starting Monday
        const day = date.getUTCDay(); // 0 Sun .. 6 Sat
        const diffToMonday = (day + 6) % 7; // 0->6 => Monday offset
        const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - diffToMonday, 0, 0, 0));
        start = monday;
        end = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 7, 0, 0, 0));
        break;
      }
      case 'monthly':
        start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0));
        end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0));
        break;
      case 'year':
        start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0));
        end = new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1, 0, 0, 0));
        break;
      default:
        throw new Error('Invalid period');
    }

    // Transactions filter
    const txWhere: any = { idUser: userId, date: { gte: start, lt: end } };
    if (txType === 'expense' || txType === 'income') txWhere.type = txType;

    // Aggregate transactions by category
    const txGroups = await this.prisma.transaction.groupBy({
      by: ['idCategory'],
      where: txWhere,
      _sum: { amount: true },
    });

    // Get budgets that overlap the period
    const budgets = await this.prisma.budget.findMany({
      where: {
        idUser: userId,
        AND: [{ periodStart: { lte: end } }, { periodEnd: { gte: start } }],
        ...(idCategory ? { idCategory } : {}),
      },
      select: { idBudget: true, idCategory: true, amount: true, periodStart: true, periodEnd: true },
    });

    // Build maps
    const spentMap = new Map<number | null, number>();
    for (const g of txGroups) {
      const key = g.idCategory === null ? null : g.idCategory;
      spentMap.set(key, g._sum.amount ? Number(g._sum.amount) : 0);
    }

    const budgetMap = new Map<number | null, number>();
    for (const b of budgets) {
      const key = b.idCategory === null ? null : b.idCategory;
      const prev = budgetMap.get(key) ?? 0;
      budgetMap.set(key, prev + Number(b.amount));
    }

    // Collect category ids to load names
    const categoryIds = new Set<number>();
    for (const k of Array.from(new Set([...Array.from(budgetMap.keys()), ...Array.from(spentMap.keys())]))) {
      if (k !== null) categoryIds.add(k as number);
    }

    const categories = categoryIds.size
      ? await this.prisma.category.findMany({ where: { idCategory: { in: Array.from(categoryIds) } }, select: { idCategory: true, name: true } })
      : [];

    // Build results per category
    const results: any[] = [];
    const keys = new Set([...budgetMap.keys(), ...spentMap.keys()]);
    for (const key of keys) {
      const budgetAmount = budgetMap.get(key) ?? 0;
      const spent = spentMap.get(key) ?? 0;
      const percent = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
      const overBudget = budgetAmount > 0 ? spent > budgetAmount : false;
      const category = key === null ? { idCategory: null, name: 'Uncategorized' } : categories.find((c) => c.idCategory === key) ?? { idCategory: key, name: 'Unknown' };
      results.push({
        idCategory: category.idCategory,
        name: category.name,
        budgetAmount,
        spent,
        percent: Math.round(percent * 100) / 100,
        overBudget,
        remaining: Math.round((budgetAmount - spent) * 100) / 100,
      });
    }

    // totals
    const totalBudget = Array.from(budgetMap.values()).reduce((a, b) => a + b, 0);
    const totalSpent = Array.from(spentMap.values()).reduce((a, b) => a + b, 0);

    return { period: { start, end, period }, totals: { totalBudget, totalSpent, percent: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0 }, data: results };
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
    
    const deleted = await this.prisma.budget.delete({ where: { idBudget: id } });
    
    // Create notification
    const message = `Budget sebesar Rp${(deleted as any).amount} untuk periode ${new Date((deleted as any).periodStart).toLocaleDateString()} - ${new Date((deleted as any).periodEnd).toLocaleDateString()} telah dihapus.`;
    await this.notificationService.create(userId, NotificationType.BUDGET_DELETED, message);
    
    return { message: 'Budget deleted' };
  }

  // Sum expenses for the budget period and category
  async getUsage(userId: number, id: number) {
    const bud = await this.findById(id);
    if (bud.idUser !== userId) throw new ForbiddenException('Not allowed');

    const categoryName = (bud as any).idCategory
      ? (
          await this.prisma.category.findUnique({
            where: { idCategory: (bud as any).idCategory },
            select: { name: true },
          })
        )?.name
      : undefined;

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
    const percent = total > 0 ? (used / total) * 100 : 0;

    // Trigger notification when overbudget
    if (total > 0 && used > total) {
      await this.notificationService.notifyBudgetExceeded(
        userId,
        total,
        used,
        categoryName,
      );
    }

    return { used, total, percent };
  }
}
