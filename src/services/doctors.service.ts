import { PrismaClient } from "@prisma/client";

export interface CreateDoctorData {
  userId: number;
  fullName: string;
  cpf: string;
  crm: string;
  specialty: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdateDoctorStatusData {
  status: "pendente" | "aprovado" | "rejeitado";
  rejectionReason?: string;
}

export class DoctorsService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateDoctorData) {
    return this.prisma.doctor.create({
      data: {
        ...data,
        status: "pendente",
      },
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
    return this.prisma.doctor.findUnique({
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
    return this.prisma.doctor.findUnique({
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

  async findByCpf(cpf: string) {
    return this.prisma.doctor.findUnique({
      where: { cpf },
    });
  }

  async findByCrm(crm: string) {
    return this.prisma.doctor.findUnique({
      where: { crm },
    });
  }

  async findAll() {
    return this.prisma.doctor.findMany({
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

  async findPending() {
    return this.prisma.doctor.findMany({
      where: {
        status: "pendente",
      },
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

  async updateStatus(id: number, data: UpdateDoctorStatusData) {
    const updateData: any = {
      status: data.status,
    };

    if (data.status === "aprovado") {
      updateData.approvedAt = new Date();
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    } else if (data.status === "rejeitado") {
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = data.rejectionReason;
      updateData.approvedAt = null;
    }

    return this.prisma.doctor.update({
      where: { id },
      data: updateData,
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
    return this.prisma.doctor.delete({
      where: { id },
    });
  }
}
