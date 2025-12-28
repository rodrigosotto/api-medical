import fp from "fastify-plugin";
import cors from "@fastify/cors";
async function corsPlugin(fastify) {
    await fastify.register(cors, {
        origin: true, // Em produção, especifique os domínios permitidos
    });
}
export default fp(corsPlugin);
