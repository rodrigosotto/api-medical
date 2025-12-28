import { FastifyRequest, FastifyReply } from "fastify";

export class DoctorsController {
  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;

    return reply.send({
      message: "Bem-vindo ao dashboard médico!",
      user: {
        id: user.id,
        name: user.name,
        type: user.type,
      },
    });
  }

  // Adicione mais métodos específicos de médicos aqui
  // Ex: listarPacientes, agendarConsulta, etc.
}
