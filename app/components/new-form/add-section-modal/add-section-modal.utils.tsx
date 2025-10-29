import { Section, SectionType } from './add-section-modal.types';

export function getSectionDefaultValues(
  type: SectionType,
  id: string,
  index: number,
): Section {
  switch (type) {
    case 'text':
      return {
        id,
        index,
        description: '',
        maxLength: undefined,
        minLength: undefined,
        required: false,
        title: '',
        type: 'text',
      };
  }
}
