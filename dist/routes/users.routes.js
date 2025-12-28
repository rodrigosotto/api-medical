import { z } from "zod";
import { UsersController } from "../controllers/users.controller.js";
import { createUserSchema, userWithPasswordSchema, } from "../schemas/users.schema.js";
import { errorSchema } from "../schemas/auth.schema.js";
export async function usersRoutes(fastify) {
    const controller = new UsersController(fastify);
    fastify.withTypeProvider().get("/users", {
        schema: {
            description: "Lista todos os usuários",
            tags: ["users"],
            response: {
                200: z.array(userWithPasswordSchema),
            },
        },
    }, controller.list.bind(controller));
    fastify.withTypeProvider().post("/users", {
        schema: {
            description: "Cria um novo usuário",
            tags: ["users"],
            body: createUserSchema,
            response: {
                201: userWithPasswordSchema,
                400: errorSchema,
                409: errorSchema,
            },
        },
    }, controller.create.bind(controller));
}
