import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserNameDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('name')
  async updateName(
    @CurrentUser() user: { userId: number },
    @Body() dto: UpdateUserNameDto,
  ) {
    return this.usersService.updateProfile(user.userId, { name: dto.name });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async resetPassword(
    @CurrentUser() user: { userId: number },
    @Body() dto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(user.userId, dto.oldPassword, dto.newPassword);
  }
}
