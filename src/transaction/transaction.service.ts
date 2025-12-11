import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService, NotificationType } from '../notification/notification.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: number, data: any) {
    // validate category if provided to avoid FK error
    const categoryId = data.idCategory ?? null;
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { idCategory: categoryId },
        select: { idCategory: true, idUser: true, name: true },
      });
      if (!category) throw new NotFoundException('Category not found');
      if (category.idUser && category.idUser !== userId) throw new ForbiddenException('Category does not belong to the user');
    }

    try {
      const tx = await this.prisma.transaction.create({
        data: {
          idUser: userId,
          idCategory: categoryId,
          // cast to any to avoid generated type conflicts for reserved names
          // e.g. 'type' property mapping
          type: data.type,
          amount: data.amount,
          description: data.description,
          date: data.date ? new Date(data.date) : new Date(),
          source: data.source,
        } as any,
      });
      
      // Create notification
      const txType = (tx as any).type === 'income' ? 'Pemasukan' : 'Pengeluaran';
      const message = `${txType} sebesar Rp${(tx as any).amount.toLocaleString('id-ID')} telah ditambahkan.`;
      await this.notificationService.create(userId, NotificationType.TRANSACTION_CREATED, message);
      
      return tx;
    } catch (err: any) {
      // Convert Prisma FK errors to a clearer HTTP error
      if (err?.code === 'P2003' || (err?.message && err.message.toLowerCase().includes('foreign key'))) {
        throw new BadRequestException('Invalid foreign key value (idCategory may not exist)');
      }
      throw err;
    }
  }

  async findAllByUser(userId: number) {
    return this.prisma.transaction.findMany({
      where: { idUser: userId },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Find transactions for a given user filtered by year and month.
   * month is 1..12
   */
  async findByMonth(userId: number, year: number, month: number) {
    if (!Number.isInteger(year) || year < 1970) throw new BadRequestException('Invalid year');
    if (!Number.isInteger(month) || month < 1 || month > 12) throw new BadRequestException('Invalid month');

    // start inclusive, nextMonth start exclusive
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const nextMonth = month === 12 ? new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0)) : new Date(Date.UTC(year, month, 1, 0, 0, 0));

    return this.prisma.transaction.findMany({
      where: {
        idUser: userId,
        date: {
          gte: start,
          lt: nextMonth,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: number) {
    const tx = await this.prisma.transaction.findUnique({ where: { idTransaction: id } });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async update(userId: number, id: number, data: any) {
    const tx = await this.findById(id);
    if (tx.idUser !== userId) throw new ForbiddenException('Not allowed');
    // validate category if provided
    const categoryId = data.idCategory ?? (tx as any).idCategory;
    if (data.idCategory !== undefined && categoryId !== null) {
      const category = await this.prisma.category.findUnique({
        where: { idCategory: categoryId },
        select: { idCategory: true, idUser: true, name: true },
      });
      if (!category) throw new NotFoundException('Category not found');
      if (category.idUser && category.idUser !== userId) throw new ForbiddenException('Category does not belong to the user');
    }

    try {
      const updated = await this.prisma.transaction.update({
        where: { idTransaction: id },
        data: {
          idCategory: data.idCategory ?? (tx as any).idCategory,
          type: data.type ?? (tx as any).type,
          amount: data.amount ?? (tx as any).amount,
          description: data.description ?? (tx as any).description,
          date: data.date ? new Date(data.date) : (tx as any).date,
          source: data.source ?? (tx as any).source,
        } as any,
      });
      return updated;
    } catch (err: any) {
      if (err?.code === 'P2003' || (err?.message && err.message.toLowerCase().includes('foreign key'))) {
        throw new BadRequestException('Invalid foreign key value (idCategory may not exist)');
      }
      throw err;
    }
  }

  async remove(userId: number, id: number) {
    const tx = await this.findById(id);
    if (tx.idUser !== userId) throw new ForbiddenException('Not allowed');
    
    const txType = (tx as any).type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const message = `${txType} sebesar Rp${(tx as any).amount.toLocaleString('id-ID')} telah dihapus.`;
    
    await this.prisma.transaction.delete({ where: { idTransaction: id } });
    await this.notificationService.create(userId, NotificationType.TRANSACTION_DELETED, message);
    
    return { message: 'Transaction deleted' };
  }
}
