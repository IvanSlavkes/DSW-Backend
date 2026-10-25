import { z } from "zod";

const playersPerTeamSchema = z.number().int().refine(
  (value) => [5, 7, 11].includes(value),
  "La cantidad de jugadores por equipo debe ser 5, 7 u 11",
);

export const fieldCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  surfaceType: z.string().trim().min(1).max(80),
  playersPerTeam: playersPerTeamSchema,
});
