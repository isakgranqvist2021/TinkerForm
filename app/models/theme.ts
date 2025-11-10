import z from 'zod';

export const updateThemeSchema = z.object({
  theme: z.enum(['light', 'dracula']),
});

export type Theme = z.infer<typeof updateThemeSchema>['theme'];
