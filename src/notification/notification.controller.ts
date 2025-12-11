import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.notificationService.findAllByUser(user.idUser);
  }

  @Get('unread')
  async findUnread(@CurrentUser() user: any) {
    return this.notificationService.findUnreadByUser(user.idUser);
  }

  @Get('unread/count')
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.notificationService.getUnreadCount(user.idUser);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.notificationService.markAsRead(user.idUser, id);
    return { message: 'Notifikasi telah ditandai sebagai dibaca' };
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationService.markAllAsRead(user.idUser);
    return { message: 'Semua notifikasi telah ditandai sebagai dibaca' };
  }
}
