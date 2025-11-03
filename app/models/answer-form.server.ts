import z from 'zod';
import { Section } from './form';

export function constructSchema(sections: Section[]) {
  const schema: Record<string, ReturnType<typeof getSchema>> = {};

  for (const section of sections) {
    schema[section.id] = getSchema(section);
  }

  return z.object(schema);
}

function getSchema(section: Section) {
  const answerschema = getAnswerSchema(section);

  return section.required
    ? answerschema
    : answerschema.optional().nullable().or(z.literal('')).or(z.undefined());
}

export function getAnswerSchema(section: Section) {
  switch (section.type) {
    case 'email':
      return z.email('Invalid email address');

    case 'phone':
      return z
        .string()
        .min(7, 'Phone number must be at least 7 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .regex(/^[\d+\-() ]+$/, 'Invalid phone number format');

    case 'text':
      return z
        .string()
        .min(section.min, 'This field is required')
        .max(section.max, 'This field exceeds maximum length');

    case 'link':
      return z.url('Invalid URL');

    case 'file':
      return z.string().min(1, 'File is required');

    case 'boolean':
      return z.boolean('This field must be true or false');

    case 'range':
      return z
        .number('This field must be a number')
        .min(section.min)
        .max(section.max);

    default:
      return z.string();
  }
}
