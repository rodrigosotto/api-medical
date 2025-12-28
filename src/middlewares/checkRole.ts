import { FastifyRequest, FastifyReply } from "fastify";

export function checkRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;

    if (!user || !allowedRoles.includes(user.type)) {
      return reply.status(403).send({
        error: `Acesso negado. Apenas ${allowedRoles.join(" ou ")} podem acessar esta rota.`,
      });
    }
  };
}
