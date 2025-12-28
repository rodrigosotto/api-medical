import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import { swaggerConfig, scalarConfig } from "../config/swagger.js";
async function swaggerPlugin(fastify) {
    await fastify.register(swagger, swaggerConfig);
    await fastify.register(scalarApiReference, scalarConfig);
}
export default fp(swaggerPlugin);
