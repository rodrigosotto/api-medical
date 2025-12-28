import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

// Plugins
import corsPlugin from "./plugins/cors.js";
import jwtPlugin from "./plugins/jwt.js";
import prismaPlugin from "./plugins/prisma.js";
import swaggerPlugin from "./plugins/swagger.js";

// Routes
import { authRoutes } from "./routes/auth.routes.js";
import { usersRoutes } from "./routes/users.routes.js";
import { doctorsRoutes } from "./routes/doctors.routes.js";
import { patientsRoutes } from "./routes/patients.routes.js";

export async function buildServer() {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>();

  // Configurar validadores Zod
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Registrar plugins
  await fastify.register(corsPlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(prismaPlugin);
  await fastify.register(swaggerPlugin);

  // Registrar rotas
  await fastify.register(authRoutes);
  await fastify.register(usersRoutes);
  await fastify.register(doctorsRoutes);
  await fastify.register(patientsRoutes);

  return fastify;
}
