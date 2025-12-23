import z from 'zod';
import { fileSchema } from './file';

export const updateTeamSchema = z.object({
  coverImage: fileSchema.nullable().optional(),
});
export type UpdateTeam = z.infer<typeof updateTeamSchema>;
