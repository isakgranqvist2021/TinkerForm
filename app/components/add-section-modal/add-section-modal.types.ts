import z from 'zod';

export const sectionTypes = ['text'] satisfies Section['type'][];

export type SectionType = (typeof sectionTypes)[number];

export type BaseSection = z.infer<typeof baseSectionSchema>;
export const baseSectionSchema = z.object({
  id: z.string(),
  index: z.number(),
  title: z.string(),
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
  sections: sectionSchema.array(),
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
