import { z } from 'zod';

export const matchSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  date: z.string().transform((val) => new Date(val)),
  time: z.string().min(1, 'La hora es obligatoria'),
  fieldType: z.string().min(1, 'El tipo de cancha es obligatorio'),
  privacy: z.string().min(1, 'La privacidad es obligatoria'),
  status: z.string().default('open'),
  fieldId: z.number().int(),
  creatorId: z.number().int(),
});
