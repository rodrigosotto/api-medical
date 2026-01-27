import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Limpar registros antigos a cada 1 minuto
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000);

interface RateLimitOptions {
  max: number;
  windowMs: number;
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const key = request.ip;
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
    } else {
      store[key].count++;

      if (store[key].count > options.max) {
        const resetInSeconds = Math.ceil((store[key].resetTime - now) / 1000);

        request.log.warn({
          message: "Rate limit excedido",
          ip: key,
          path: request.url,
          count: store[key].count,
        });

        return reply.status(429).send({
          error:
            options.message || "Muitas requisições. Tente novamente mais tarde",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: resetInSeconds,
        });
      }
    }
  };
}

async function rateLimitPlugin(fastify: FastifyInstance) {
  fastify.decorate("rateLimit", createRateLimiter);
}

export default fp(rateLimitPlugin);
