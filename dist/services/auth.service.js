import bcrypt from "bcryptjs";
export class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateUser(email, password) {
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
