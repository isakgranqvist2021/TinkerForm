import z from 'zod';
import { Section, SectionType } from './form';

export function constructSchema(sections: Section[]) {
  const schema: Record<string, ReturnType<typeof getSchema>> = {};

  for (const section of sections) {
    schema[section.id] = getSchema(section);
  }

  return z.object(schema);
}

function getSchema(section: Section) {
  const answerschema = getAnswerSchema(section.type);

  return section.required ? answerschema : answerschema.optional().nullable();
}

export function getAnswerSchema(type: SectionType) {
  switch (type) {
    case 'email':
      return z.email('Invalid email address');

    case 'phone':
      return z
        .string()
        .min(7, 'Phone number must be at least 7 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .regex(/^[\d+\-() ]+$/, 'Invalid phone number format');

    case 'text':
      return z.string().min(1, 'This field is required');

    case 'link':
      return z.url('Invalid URL');

    case 'file':
      return z.string().min(1, 'File is required');

    default:
      return z.string();
  }
}
