import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import { env } from "../config/env.js";

async function jwtPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });
}

export default fp(jwtPlugin);
