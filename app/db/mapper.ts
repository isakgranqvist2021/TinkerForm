import { SelectedSection } from './schema';
import { Section } from 'models/form';

export function sectionMapper(section: SelectedSection): Section {
  const type = section.type;

  switch (type) {
    case 'text':
    case 'range':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
        min: section.min ?? 0,
        max: section.max ?? 0,
      };

    case 'email':
    case 'link':
    case 'phone':
    case 'file':
    case 'boolean':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
      };

    case 'multiple-choice':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
        options: section.options ?? [],
      };

    default:
      throw new Error(`Unknown section type: ${section.type}`);
  }
}
