import { Section, SectionType } from 'models/form';

export function getSectionDefaultValues(type: SectionType): Section {
  switch (type) {
    case 'text':
    case 'link':
    case 'email':
    case 'phone':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
      };
  }
}
