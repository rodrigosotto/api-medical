import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  loginSchema,
  tokenResponseSchema,
  errorSchema,
} from "../schemas/auth.schema.js";
import {
  userResponseSchema,
  updateUserSchema,
} from "../schemas/users.schema.js";

export async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController(fastify);

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        description: "Autentica um usuário e retorna um token JWT",
        tags: ["auth"],
        body: loginSchema,
        response: {
          200: tokenResponseSchema,
          401: errorSchema,
        },
      },
    },
    controller.login.bind(controller)
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/profile",
    {
      onRequest: [authenticate],
      schema: {
        description: "Retorna o perfil do usuário autenticado",
        tags: ["auth"],
        security: [{ bearerAuth: [] }],
        response: {
          200: userResponseSchema,
          404: errorSchema,
        },
      },
    },
    controller.getProfile.bind(controller)
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/profile",
    {
      onRequest: [authenticate],
      schema: {
        description: "Atualiza os dados do usuário autenticado",
        tags: ["auth"],
        security: [{ bearerAuth: [] }],
        body: updateUserSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    controller.updateProfile.bind(controller)
  );
}
