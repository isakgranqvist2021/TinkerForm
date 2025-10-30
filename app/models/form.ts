import z from 'zod';

export const sectionTypes = [
  'text',
  'link',
  'phone',
  'email',
] satisfies Section['type'][];

export type SectionType = (typeof sectionTypes)[number];

export type BaseSection = z.infer<typeof baseSectionSchema>;
export const baseSectionSchema = z.object({
  id: z.string(),
  index: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description is too long')
    .optional(),
});

export type TextSection = z.infer<typeof textSectionSchema>;
export const textSectionSchema = baseSectionSchema.extend({
  type: z.literal('text'),
  required: z.boolean(),
});

export type LinkSection = z.infer<typeof linkSectionSchema>;
export const linkSectionSchema = baseSectionSchema.extend({
  type: z.literal('link'),
  required: z.boolean(),
});

export type EmailSection = z.infer<typeof emailSectionSchema>;
export const emailSectionSchema = baseSectionSchema.extend({
  type: z.literal('email'),
  required: z.boolean(),
});

export type PhoneSection = z.infer<typeof phoneSectionSchema>;
export const phoneSectionSchema = baseSectionSchema.extend({
  type: z.literal('phone'),
  required: z.boolean(),
});

export const sectionSchema = z.discriminatedUnion('type', [
  textSectionSchema,
  linkSectionSchema,
  emailSectionSchema,
  phoneSectionSchema,
]);
export type Section = z.infer<typeof sectionSchema>;

export type Form = z.infer<typeof formSchema>;
export const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description is too long'),
  sections: sectionSchema.array().min(1, 'At least one section is required'),
});

function refineNumber(value: any) {
  if (value === undefined) {
    return true;
  }

  const asNumber = Number(value);

  if (isNaN(asNumber)) {
    return false;
  }

  if (asNumber === 0) {
    return true;
  }

  return true;
}
