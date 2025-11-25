import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { name: dto.name, /* other fields if exist */ } });
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: number) {
    const c = await this.prisma.category.findUnique({ where: { idCategory: id } });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findById(id);
    return this.prisma.category.update({ where: { idCategory: id }, data: { name: dto.name ?? undefined } });
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prisma.category.delete({ where: { idCategory: id } });
    return { message: 'Category deleted' };
  }
}
