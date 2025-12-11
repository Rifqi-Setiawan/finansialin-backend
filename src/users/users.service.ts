import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService, NotificationType } from '../notification/notification.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ 
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { idUser: id },
      select: {
        idUser: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(data: { email: string; password: string; name?: string }) {
    return this.prisma.user.create({ 
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
  }

  async updateProfile(userId: number, data: { name?: string }) {
    return this.prisma.user.update({
      where: { idUser: userId },
      data,
      select: {
        idUser: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async resetPassword(userId: number, oldPassword: string, newPassword: string) {
    // Get user with password field
    const user = await this.prisma.user.findUnique({
      where: { idUser: userId },
      select: {
        idUser: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { idUser: userId },
      data: { password: hashedPassword },
    });

    // Create notification
    const message = 'Password Anda telah berhasil diubah.';
    await this.notificationService.create(userId, NotificationType.PASSWORD_RESET, message);

    return { message: 'Password updated successfully' };
  }
}
