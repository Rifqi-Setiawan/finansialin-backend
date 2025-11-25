import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateTransactionDto) {
    return this.txService.create(user.idUser, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.txService.findAllByUser(user.idUser);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    const tx = await this.txService.findById(id);
    if (tx.idUser !== user.idUser) return { error: 'Not allowed' };
    return tx;
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransactionDto) {
    return this.txService.update(user.idUser, id, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.txService.remove(user.idUser, id);
  }
}
