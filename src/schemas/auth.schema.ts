import { z } from "zod";
import { userResponseSchema } from "./users.schema.js";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().optional(),
  userType: z.enum(["patient", "doctor"]).optional(),
});

export const tokenResponseSchema = z.object({
  user: userResponseSchema,
  token: z.string(),
  refreshToken: z.string(),
});

export const errorSchema = z.object({
  error: z.string(),
});

// Doctor Registration Schema
export const doctorRegistrationSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, "CPF inválido"),
    crm: z.string().min(3, "CRM é obrigatório"),
    specialty: z.string().min(3, "Especialidade é obrigatória"),
    phone: z.string().min(10, "Telefone inválido"),
    street: z.string().min(3, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, "Bairro é obrigatório"),
    city: z.string().min(3, "Cidade é obrigatória"),
    state: z.string().length(2, "Estado inválido"),
    zipCode: z.string().regex(/^\d{5}-\d{3}$|^\d{8}$/, "CEP inválido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Patient Registration Schema
export const patientRegistrationSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    phone: z.string().min(10, "Telefone inválido"),
    street: z.string().min(3, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, "Bairro é obrigatório"),
    city: z.string().min(3, "Cidade é obrigatória"),
    state: z.string().length(2, "Estado inválido"),
    zipCode: z.string().regex(/^\d{5}-\d{3}$|^\d{8}$/, "CEP inválido"),
    hasInsurance: z.boolean(),
    insuranceName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => !data.hasInsurance || data.insuranceName, {
    message: "Nome do plano é obrigatório quando possui plano de saúde",
    path: ["insuranceName"],
  });
