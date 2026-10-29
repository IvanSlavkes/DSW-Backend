import { z } from 'zod';

const ROLES = ['user', 'moderator', 'admin', 'disabled'] as const;

export const userSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  description: z.string().optional(),
  position: z.string(),
  secondaryPosition: z.string().nullable().optional(),
  birthDate: z.string().transform((val) => new Date(val)),
  localityId: z.string(),
  role: z.enum(ROLES).default('user'),
});

// Para editar: todos los campos opcionales y SIN valor por defecto en role.
// (En Zod 4, userSchema.partial() seguiría aplicando default("user") y le bajaría el rol a cualquiera.)
export const userUpdateSchema = userSchema
  .omit({ role: true })
  .partial()
  .extend({ role: z.enum(ROLES).optional(), secondaryPosition: z.string().nullable().optional() });
