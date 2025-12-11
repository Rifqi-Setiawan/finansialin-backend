import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum NotificationType {
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_DELETED = 'TRANSACTION_DELETED',
  BUDGET_CREATED = 'BUDGET_CREATED',
  BUDGET_DELETED = 'BUDGET_DELETED',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  BUDGET_WARNING = 'BUDGET_WARNING',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, type: NotificationType, message: string) {
    return this.prisma.notification.create({
      data: {
        idUser: userId,
        type,
        message,
        read: false,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { idUser: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnreadByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { idUser: userId, read: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(userId: number, id: number) {
    return this.prisma.notification.updateMany({
      where: { idNotification: id, idUser: userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { idUser: userId, read: false },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: { idUser: userId, read: false },
    });
  }

  // Helper methods untuk membuat notifikasi dengan copywriting bahasa Indonesia

  async notifyTransactionCreated(
    userId: number,
    type: 'income' | 'expense',
    amount: number,
    description?: string,
  ) {
    const formattedAmount = this.formatCurrency(amount);
    const transactionType = type === 'income' ? 'pemasukan' : 'pengeluaran';
    const desc = description ? ` untuk "${description}"` : '';

    const message = `Transaksi ${transactionType} sebesar ${formattedAmount}${desc} berhasil dicatat.`;

    return this.create(userId, NotificationType.TRANSACTION_CREATED, message);
  }

  async notifyTransactionDeleted(
    userId: number,
    type: 'income' | 'expense',
    amount: number,
    description?: string,
  ) {
    const formattedAmount = this.formatCurrency(amount);
    const transactionType = type === 'income' ? 'pemasukan' : 'pengeluaran';
    const desc = description ? ` "${description}"` : '';

    const message = `Transaksi ${transactionType}${desc} sebesar ${formattedAmount} telah dihapus dari catatan Anda.`;

    return this.create(userId, NotificationType.TRANSACTION_DELETED, message);
  }

  async notifyBudgetCreated(
    userId: number,
    amount: number,
    categoryName?: string,
  ) {
    const formattedAmount = this.formatCurrency(amount);
    const category = categoryName ? ` untuk kategori "${categoryName}"` : '';

    const message = `Anggaran baru${category} sebesar ${formattedAmount} berhasil dibuat. Pantau pengeluaran Anda agar tetap sesuai rencana!`;

    return this.create(userId, NotificationType.BUDGET_CREATED, message);
  }

  async notifyBudgetDeleted(
    userId: number,
    amount: number,
    categoryName?: string,
  ) {
    const formattedAmount = this.formatCurrency(amount);
    const category = categoryName ? ` kategori "${categoryName}"` : '';

    const message = `Anggaran${category} sebesar ${formattedAmount} telah dihapus dari daftar anggaran Anda.`;

    return this.create(userId, NotificationType.BUDGET_DELETED, message);
  }

  async notifyBudgetExceeded(
    userId: number,
    budgetAmount: number,
    spentAmount: number,
    categoryName?: string,
  ) {
    const formattedBudget = this.formatCurrency(budgetAmount);
    const formattedSpent = this.formatCurrency(spentAmount);
    const overAmount = this.formatCurrency(spentAmount - budgetAmount);
    const category = categoryName ? ` "${categoryName}"` : '';

    const message = `Perhatian! Anggaran${category} Anda telah terlampaui. Batas anggaran: ${formattedBudget}, total pengeluaran: ${formattedSpent} (melebihi ${overAmount}). Pertimbangkan untuk meninjau kembali pengeluaran Anda.`;

    return this.create(userId, NotificationType.BUDGET_EXCEEDED, message);
  }

  async notifyBudgetWarning(
    userId: number,
    budgetAmount: number,
    spentAmount: number,
    percentage: number,
    categoryName?: string,
  ) {
    const formattedBudget = this.formatCurrency(budgetAmount);
    const formattedSpent = this.formatCurrency(spentAmount);
    const remaining = this.formatCurrency(budgetAmount - spentAmount);
    const category = categoryName ? ` "${categoryName}"` : '';

    const message = `Peringatan! Anggaran${category} Anda telah mencapai ${percentage.toFixed(0)}%. Total pengeluaran: ${formattedSpent} dari ${formattedBudget}. Sisa anggaran: ${remaining}. Bijak dalam mengelola keuangan Anda!`;

    return this.create(userId, NotificationType.BUDGET_WARNING, message);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
