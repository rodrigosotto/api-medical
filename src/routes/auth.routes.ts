import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { createRateLimiter } from "../plugins/rateLimit.js";
import {
  loginSchema,
  registerSchema,
  tokenResponseSchema,
  errorSchema,
  doctorRegistrationSchema,
  patientRegistrationSchema,
} from "../schemas/auth.schema.js";
import {
  userResponseSchema,
  updateUserSchema,
} from "../schemas/users.schema.js";

export async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController(fastify);

  // Rate limiter para login: máximo 5 tentativas a cada 15 minutos
  const loginRateLimit = createRateLimiter({
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: "Muitas tentativas de login. Tente novamente em 15 minutos",
  });

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        description: "Registra um novo usuário e retorna um token JWT",
        tags: ["auth"],
        body: registerSchema,
        response: {
          201: tokenResponseSchema,
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    controller.register.bind(controller),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      onRequest: [loginRateLimit],
      schema: {
        description: "Autentica um usuário e retorna um token JWT",
        tags: ["auth"],
        body: loginSchema,
        response: {
          200: tokenResponseSchema,
          401: errorSchema,
          429: z.object({
            error: z.string(),
            code: z.string(),
            retryAfter: z.number(),
          }),
        },
      },
    },
    controller.login.bind(controller),
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
    controller.getProfile.bind(controller),
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
    controller.updateProfile.bind(controller),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        description: "Registra um novo usuário",
        tags: ["auth"],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          type: z.enum(["medico", "paciente"]),
        }),
        response: {
          201: z.object({
            user: userResponseSchema,
            token: z.string(),
            refreshToken: z.string(),
          }),
          409: errorSchema,
        },
      },
    },
    controller.register.bind(controller),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/refresh",
    {
      schema: {
        description: "Renova o token de acesso usando o refresh token",
        tags: ["auth"],
        body: z.object({
          refreshToken: z.string(),
        }),
        response: {
          200: z.object({
            user: userResponseSchema,
            token: z.string(),
            refreshToken: z.string(),
          }),
          401: errorSchema,
        },
      },
    },
    controller.refreshToken.bind(controller),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/logout",
    {
      onRequest: [authenticate],
      schema: {
        description: "Realiza logout do usuário",
        tags: ["auth"],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    controller.logout.bind(controller),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register/doctor",
    {
      schema: {
        description: "Registra um novo médico (aguarda aprovação)",
        tags: ["auth"],
        body: doctorRegistrationSchema,
        response: {
          201: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              type: z.string(),
            }),
            doctor: z.object({
              id: z.number(),
              status: z.string(),
            }),
          }),
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    controller.registerDoctor.bind(controller),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register/patient",
    {
      schema: {
        description: "Registra um novo paciente",
        tags: ["auth"],
        body: patientRegistrationSchema,
        response: {
          201: z.object({
            user: userResponseSchema,
            patient: z.object({
              id: z.number(),
            }),
            token: z.string(),
            refreshToken: z.string(),
          }),
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    controller.registerPatient.bind(controller),
  );
}
