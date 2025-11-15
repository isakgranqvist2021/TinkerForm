import z from 'zod';

export type ScoreResponse = z.infer<typeof scoreResponseSchema>;
export const scoreResponseSchema = z.object({
  responseId: z.string(),
  score: z.number().min(0).max(1),
  reasoning: z.string(),
});
