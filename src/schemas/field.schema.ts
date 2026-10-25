import { z } from 'zod';

export const fieldSchema = z.object({
  name: z.string().min(4, 'El nombre es obligatorio'),
  address: z.string().min(1, 'La dirección es obligatoria'),
  categoryId: z.number().int().positive(),
  price: z.coerce.number().finite().nonnegative().optional(),
  localityId: z.string().min(1),
});
