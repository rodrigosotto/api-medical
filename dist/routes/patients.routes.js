import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRole } from "../middlewares/checkRole.js";
import { errorSchema } from "../schemas/auth.schema.js";
export async function patientsRoutes(fastify) {
    // Exemplo de rota para pacientes (implementar controller depois)
    fastify.withTypeProvider().get("/patients/dashboard", {
        onRequest: [authenticate, checkRole(["paciente"])],
        schema: {
            description: "Dashboard exclusivo para pacientes",
            tags: ["patients"],
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
    }, async (request, reply) => {
        const user = request.user;
        return reply.send({
            message: "Bem-vindo ao dashboard de pacientes!",
            user: {
                id: user.id,
                name: user.name,
                type: user.type,
            },
        });
    });
    // Adicione mais rotas específicas de pacientes aqui
}
