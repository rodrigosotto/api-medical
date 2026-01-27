import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    const error = err as Error;

    // Log estruturado do erro de autenticação
    request.log.warn({
      message: "Falha na autenticação",
      error: error.message,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
      path: request.url,
      method: request.method,
    });

    reply.status(401).send({
      error: "Token inválido ou expirado",
      code: "INVALID_TOKEN",
    });
  }
}
