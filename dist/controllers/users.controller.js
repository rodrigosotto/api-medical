import { UsersService } from "../services/users.service.js";
export class UsersController {
    constructor(fastify) {
        this.usersService = new UsersService(fastify.prisma);
    }
    async list(request, reply) {
        const users = await this.usersService.findAll();
        return reply.send(users);
    }
    async create(request, reply) {
        const { name, email, password, type } = request.body;
        try {
            const user = await this.usersService.create({
                name,
                email,
                password,
                type,
            });
            return reply.status(201).send(user);
        }
        catch (error) {
            if (error?.code === "P2002") {
                return reply.status(409).send({ error: "Email já cadastrado" });
            }
            return reply.status(400).send({ error: "Erro ao criar usuário" });
        }
    }
}
