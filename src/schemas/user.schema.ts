import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  description: z.string().optional(),
  locationId: z.string(),
  locationName: z.string(),
  position: z.string(),
  birthDate: z.string().transform((val) => new Date(val)),
  role: z.string().default("user")
});
