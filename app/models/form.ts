import z from 'zod';
import { themeSchema } from './theme';

export type SectionType = (typeof sectionTypes)[number];
export const sectionTypes = [
  'text',
  'link',
  'phone',
  'email',
  'file',
  'range',
  'boolean',
  'multiple-choice',
] satisfies Section['type'][];

export type BaseSection = z.infer<typeof baseSectionSchema>;
export const baseSectionSchema = z.object({
  id: z.string(),
  index: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description is too long'),
  required: z.boolean(),
});

export type TextSection = z.infer<typeof textSectionSchema>;
export const textSectionSchema = baseSectionSchema
  .extend({
    min: z.number().min(1),
    max: z.number().min(1).max(5000, 'Can not exceed 5000'),
    type: z.literal('text'),
  })
  .refine((data) => data.max > data.min, {
    message: 'max must be greater than min',
    path: ['max'],
  });

export type LinkSection = z.infer<typeof linkSectionSchema>;
export const linkSectionSchema = baseSectionSchema.extend({
  type: z.literal('link'),
});

export type EmailSection = z.infer<typeof emailSectionSchema>;
export const emailSectionSchema = baseSectionSchema.extend({
  type: z.literal('email'),
});

export type PhoneSection = z.infer<typeof phoneSectionSchema>;
export const phoneSectionSchema = baseSectionSchema.extend({
  type: z.literal('phone'),
});

export type FileSection = z.infer<typeof fileSectionSchema>;
export const fileSectionSchema = baseSectionSchema.extend({
  type: z.literal('file'),
  acceptedFileTypes: z.string().nullable(),
});

export type RangeSection = z.infer<typeof rangeSectionSchema>;
export const rangeSectionSchema = baseSectionSchema
  .extend({
    type: z.literal('range'),
    min: z.number().min(1),
    max: z.number().min(1).max(9999999, 'Can not exceed 9999999'),
  })
  .refine((data) => data.max > data.min, {
    message: 'max must be greater than min',
    path: ['max'],
  });

export type BooleanSection = z.infer<typeof booleanSectionSchema>;
export const booleanSectionSchema = baseSectionSchema.extend({
  type: z.literal('boolean'),
});

export type MultipleChoiceOption = z.infer<typeof multipleChoiceOptionSchema>;
export const multipleChoiceOptionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
});
export type MultipleChoiceSection = z.infer<typeof multipleChoiceSectionSchema>;
export const multipleChoiceSectionSchema = baseSectionSchema.extend({
  type: z.literal('multiple-choice'),
  options: z
    .array(multipleChoiceOptionSchema)
    .min(2, 'At least two options are required'),
});

export const sectionSchema = z.discriminatedUnion('type', [
  textSectionSchema,
  linkSectionSchema,
  emailSectionSchema,
  phoneSectionSchema,
  fileSectionSchema,
  rangeSectionSchema,
  booleanSectionSchema,
  multipleChoiceSectionSchema,
]);
export type Section = z.infer<typeof sectionSchema>;

export const COVER_IMAGE_FILE_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
];
export const COVER_IMAGE_MAX_SIZE = 5000000; // 5MB
export const fileSchema = z
  .instanceof(File, { message: 'File is required' })
  .refine(
    (file) => file && file.size > 0 && file.size <= COVER_IMAGE_MAX_SIZE,
    {
      message: 'File must not be empty and must be ≤ 5MB',
    },
  )
  .refine((value) => value instanceof File || typeof value === 'string', {
    message: 'File is required',
  });

export type Form = z.infer<typeof formSchema>;
export const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(10000, 'Description is too long'),
  sections: sectionSchema.array().min(1, 'At least one section is required'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(500, 'Location is too long'),
  coverImage: fileSchema,
  theme: themeSchema,
});
