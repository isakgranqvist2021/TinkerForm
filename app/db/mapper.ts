import { InferSelectModel } from 'drizzle-orm';
import { sectionTable } from './schema';
import { Section } from 'models/form';

export function sectionMapper(
  section: InferSelectModel<typeof sectionTable>,
): Section {
  switch (section.type) {
    case 'text':
      return {
        type: 'text',
        description: section.description || undefined,
        id: section.id,
        index: section.index,
        maxLength: section.max_length?.toString(),
        minLength: section.min_length?.toString(),
        required: Boolean(section.required),
        title: section.title,
      };

    default:
      throw new Error(`Unknown section type: ${section.type}`);
  }
}
