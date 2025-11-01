import { InferSelectModel } from 'drizzle-orm';
import { sectionTable } from './schema';
import { Section, SectionType } from 'models/form';

export function sectionMapper(
  section: InferSelectModel<typeof sectionTable>,
): Section {
  const type = section.type as SectionType;

  switch (type) {
    case 'text':
    case 'email':
    case 'link':
    case 'phone':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
      };

    default:
      throw new Error(`Unknown section type: ${section.type}`);
  }
}
