import z from 'zod';

export const updateThemeSchema = z.object({
  theme: z.enum(['light', 'dark']),
});

export type Theme = z.infer<typeof updateThemeSchema>['theme'];
