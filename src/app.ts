import { buildServer } from "./server.js";
import { env } from "./config/env.js";

const start = async () => {
  try {
    const fastify = await buildServer();

    await fastify.listen({ port: env.PORT, host: "0.0.0.0" });

    console.log(`🚀 API rodando na porta ${env.PORT}`);
    console.log(
      `📚 Documentação disponível em http://localhost:${env.PORT}/docs`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
