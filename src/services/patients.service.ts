import { PrismaClient } from "@prisma/client";

export interface CreatePatientData {
  userId: number;
  fullName: string;
  phone: string;
  photo?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  hasInsurance: boolean;
  insuranceName?: string;
}

export class PatientsService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePatientData) {
    return this.prisma.patient.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            type: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            type: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            type: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(id: number, data: Partial<CreatePatientData>) {
    return this.prisma.patient.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            type: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
