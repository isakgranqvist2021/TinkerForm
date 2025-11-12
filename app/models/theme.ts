import { Theme } from 'config/theme';
import z from 'zod';

export const themeSchema = z.enum(Object.values(Theme));
export const updateThemeSchema = z.object({
  theme: themeSchema,
});
