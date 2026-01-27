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

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { name, type } = request.body as {
      name?: string;
      type?: string;
    };

    try {
      const user = await this.usersService.update(Number(id), { name, type });
      return reply.send(user);
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }
      return reply.status(400).send({ error: "Erro ao atualizar usuário" });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      await this.usersService.delete(Number(id));
      return reply.status(204).send();
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }
      return reply.status(400).send({ error: "Erro ao deletar usuário" });
    }
  }
}
