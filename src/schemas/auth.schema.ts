import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  position: z.string().min(1),
  birthDate: z.string().transform((val) => new Date(val)),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
