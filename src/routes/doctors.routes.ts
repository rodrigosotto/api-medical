import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { DoctorsController } from "../controllers/doctors.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/checkRole.js";
import { errorSchema } from "../schemas/auth.schema.js";

export async function doctorsRoutes(fastify: FastifyInstance) {
  const controller = new DoctorsController();

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/doctors/dashboard",
    {
      onRequest: [authenticate, checkRole(["medico"])],
      schema: {
        description: "Dashboard exclusivo para médicos",
        tags: ["doctors"],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              type: z.string(),
            }),
          }),
          403: errorSchema,
        },
      },
    },
    controller.getDashboard.bind(controller)
  );

  // Adicione mais rotas específicas de médicos aqui
}
