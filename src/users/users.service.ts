import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
        // Don't select password
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
}
