import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const tokenResponseSchema = z.object({
  token: z.string(),
});

export const errorSchema = z.object({
  error: z.string(),
});
