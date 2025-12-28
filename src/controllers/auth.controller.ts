import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { AuthService } from "../services/auth.service.js";
import { UsersService } from "../services/users.service.js";

export class AuthController {
  private authService: AuthService;
  private usersService: UsersService;

  constructor(fastify: FastifyInstance) {
    this.authService = new AuthService(fastify.prisma);
    this.usersService = new UsersService(fastify.prisma);
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const token = request.server.jwt.sign(user);

    return reply.send({ token });
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const userId = user.id;

    const profile = await this.usersService.findById(userId);

    if (!profile) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    return reply.send(profile);
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const userId = user.id;
    const { name, type } = request.body as { name?: string; type?: string };

    const updatedUser = await this.usersService.update(userId, { name, type });

    return reply.send(updatedUser);
  }
}
