import { z } from "zod";

export const createMatchSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  date: z.coerce.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  duration: z.number().int().positive().optional(),
  privacy: z.enum(["public", "private"]),
  fieldId: z.number().int().positive(),
  teamAName: z.string().trim().min(1).max(50),
  positionType: z.enum(["arquero", "defensor", "centrocampista", "delantero"]).optional(),
  secondaryPositionType: z.enum(["arquero", "defensor", "centrocampista", "delantero"]).optional(),
});

export const updateMatchSchema = createMatchSchema
  .omit({ fieldId: true, teamAName: true, positionType: true, secondaryPositionType: true })
  .partial()
  .extend({ status: z.string().optional() });
