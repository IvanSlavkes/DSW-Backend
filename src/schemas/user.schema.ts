import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  description: z.string().optional(),
  position: z.string(),
  birthDate: z.string().transform((val) => new Date(val)),
  localityId: z.string(),   
  role: z.string().default("user")
});
