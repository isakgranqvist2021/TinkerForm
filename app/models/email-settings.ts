import z from 'zod';

export type UpdateEmailSettings = z.infer<typeof updateEmailSettingsSchema>;
export const updateEmailSettingsSchema = z.object({
  productUpdates: z.boolean(),
  marketing: z.boolean(),
});
