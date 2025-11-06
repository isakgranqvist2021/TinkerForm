import { SelectedAnswer, SelectedResponse, SelectedSection } from './schema';
import { Section, SectionType } from 'models/form';

export function sectionMapper(section: SelectedSection): Section {
  const type = section.type as SectionType;

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

    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}
