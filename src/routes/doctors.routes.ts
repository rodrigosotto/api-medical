import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { DoctorsController } from "../controllers/doctors.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/checkRole.js";
import { errorSchema } from "../schemas/auth.schema.js";
import { DoctorsService } from "../services/doctors.service.js";

export async function doctorsRoutes(fastify: FastifyInstance) {
  const controller = new DoctorsController();
  const doctorsService = new DoctorsService(fastify.prisma);
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
    controller.getDashboard.bind(controller),
  );

  // Listar todos os médicos
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/doctors",
    {
      onRequest: [authenticate],
      schema: {
        description: "Lista todos os médicos",
        tags: ["doctors"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const doctors = await doctorsService.findAll();
      return reply.send(doctors);
    },
  );

  // Listar médicos pendentes de aprovação
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/doctors/pending",
    {
      onRequest: [authenticate],
      schema: {
        description: "Lista médicos pendentes de aprovação",
        tags: ["doctors"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const doctors = await doctorsService.findPending();
      return reply.send(doctors);
    },
  );

  // Obter detalhes de um médico
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/doctors/:id",
    {
      onRequest: [authenticate],
      schema: {
        description: "Obtém os detalhes de um médico",
        tags: ["doctors"],
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string().transform(Number),
        }),
        response: {
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const doctor = await doctorsService.findById(id);

      if (!doctor) {
        return reply.status(404).send({ error: "Médico não encontrado" });
      }

      return reply.send(doctor);
    },
  );

  // Aprovar médico
  fastify.withTypeProvider<ZodTypeProvider>().patch(
    "/doctors/:id/approve",
    {
      onRequest: [authenticate],
      schema: {
        description: "Aprova o cadastro de um médico",
        tags: ["doctors"],
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string().transform(Number),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const user = request.user as any;

      const doctor = await doctorsService.findById(id);
      if (!doctor) {
        return reply.status(404).send({ error: "Médico não encontrado" });
      }

      await doctorsService.updateStatus(id, {
        status: "aprovado",
      });

      request.log.info({
        message: "Médico aprovado",
        doctorId: id,
        approvedBy: user.id,
      });

      return reply.send({
        message: "Médico aprovado com sucesso",
      });
    },
  );

  // Rejeitar médico
  fastify.withTypeProvider<ZodTypeProvider>().patch(
    "/doctors/:id/reject",
    {
      onRequest: [authenticate],
      schema: {
        description: "Rejeita o cadastro de um médico",
        tags: ["doctors"],
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string().transform(Number),
        }),
        body: z.object({
          rejectionReason: z
            .string()
            .min(10, "Motivo deve ter no mínimo 10 caracteres"),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const { rejectionReason } = request.body as { rejectionReason: string };
      const user = request.user as any;

      const doctor = await doctorsService.findById(id);
      if (!doctor) {
        return reply.status(404).send({ error: "Médico não encontrado" });
      }

      await doctorsService.updateStatus(id, {
        status: "rejeitado",
        rejectionReason,
      });

      request.log.info({
        message: "Médico rejeitado",
        doctorId: id,
        rejectedBy: user.id,
        reason: rejectionReason,
      });

      return reply.send({
        message: "Médico rejeitado",
      });
    },
  );
}
