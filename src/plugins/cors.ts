import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import cors from "@fastify/cors";

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true, // Em produção, especifique os domínios permitidos
  });
}

export default fp(corsPlugin);
