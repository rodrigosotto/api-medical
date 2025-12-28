import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UsersService } from "../services/users.service.js";

export class UsersController {
  private usersService: UsersService;

  constructor(fastify: FastifyInstance) {
    this.usersService = new UsersService(fastify.prisma);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.usersService.findAll();
    return reply.send(users);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, type } = request.body as {
      name: string;
      email: string;
      password: string;
      type: string;
    };

    try {
      const user = await this.usersService.create({
        name,
        email,
        password,
        type,
      });
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error?.code === "P2002") {
        return reply.status(409).send({ error: "Email já cadastrado" });
      }
      return reply.status(400).send({ error: "Erro ao criar usuário" });
    }
  }
}
