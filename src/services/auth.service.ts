import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    };
  }
}
