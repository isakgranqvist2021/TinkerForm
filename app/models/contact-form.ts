import z from 'zod';

export type ContactFormModel = z.infer<typeof contactFormSchema>;
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.email('Invalid email address'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message is too long'),
});
