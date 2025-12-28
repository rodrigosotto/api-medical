import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        password: true,
        createdAt: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    type: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 8);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        type: data.type,
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        password: true,
        createdAt: true,
      },
    });
  }

  async update(id: number, data: { name?: string; type?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
      },
    });
  }
}
