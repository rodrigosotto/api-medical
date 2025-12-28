import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  type: z.string().min(1, "Tipo é obrigatório"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  type: z.string().min(1, "Tipo é obrigatório").optional(),
});

export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  type: z.string(),
  createdAt: z.date(),
});

export const userWithPasswordSchema = userResponseSchema.extend({
  password: z.string(),
});
