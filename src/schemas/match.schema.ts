import { z } from "zod";

export const createMatchSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  date: z.coerce.date(),
  time: z.string().min(1),
  duration: z.number().int().positive().optional(),
  privacy: z.string().min(1),
  fieldId: z.number().int().positive(),
  creatorId: z.number().int().positive(),
});

export const updateMatchSchema = createMatchSchema
  .omit({ fieldId: true, creatorId: true })
  .partial()
  .extend({ status: z.string().optional() });
