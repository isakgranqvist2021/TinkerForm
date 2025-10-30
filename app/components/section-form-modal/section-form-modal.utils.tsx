import { Section, SectionType } from 'models/form';

export function getSectionDefaultValues(type: SectionType): Section {
  switch (type) {
    case 'text':
      return {
        id: '',
        index: 0,
        description: '',
        minLength: '1',
        maxLength: '500',
        required: false,
        title: '',
        type: 'text',
      };
  }
}
