import { z } from "zod"

export const fieldSchema = z.object({
  name: z.string().min(4, "El nombre es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  type: z.string().min(1, "El tipo es obligatorio"),
  locationId: z.string().min(1),
  locationName: z.string().min(1),
});