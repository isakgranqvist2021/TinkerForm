import z from 'zod';

export const IMAGE_FILE_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
];
export const IMAGE_MAX_SIZE = 5000000; // 5MB
export const fileSchema = z
  .instanceof(File, { message: 'File is required' })
  .refine((file) => file && file.size > 0 && file.size <= IMAGE_MAX_SIZE, {
    message: 'File must not be empty and must be less than 5MB',
  })
  .refine((value) => value instanceof File || typeof value === 'string', {
    message: 'File is required',
  });

export const uploadSchema = z.object({
  // File to upload
  file: fileSchema.nullable(),

  // Previous URL to delete
  url: z.string().nullable().optional(),
});
export type UploadParams = z.infer<typeof uploadSchema>;
