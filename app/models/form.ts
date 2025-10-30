import z from 'zod';

export const sectionTypes = ['text'] satisfies Section['type'][];

export type SectionType = (typeof sectionTypes)[number];

export type BaseSection = z.infer<typeof baseSectionSchema>;
export const baseSectionSchema = z.object({
  id: z.string(),
  index: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type TextSection = z.infer<typeof textSectionSchema>;
export const textSectionSchema = baseSectionSchema.extend({
  type: z.literal('text'),
  required: z.boolean(),
  minLength: z.string().optional().refine(refineNumber),
  maxLength: z.string().optional().refine(refineNumber),
});

export const sectionSchema = z.discriminatedUnion('type', [textSectionSchema]);
export type Section = z.infer<typeof sectionSchema>;

export type Form = z.infer<typeof formSchema>;
export const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
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
