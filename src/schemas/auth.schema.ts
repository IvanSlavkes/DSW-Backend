import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  position: z.string().min(1, 'Elegí una posición'),
  birthDate: z
    .string()
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      'La fecha de nacimiento no es válida',
    )
    .transform((value) => new Date(value)),
});

export const loginSchema = z.object({
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
