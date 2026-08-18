import { z } from "zod"

export const canchaSchema = z.object({
  nombre: z.string().min(4, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  localidadId: z.string().min(1),
  localidadNombre: z.string().min(1),
});