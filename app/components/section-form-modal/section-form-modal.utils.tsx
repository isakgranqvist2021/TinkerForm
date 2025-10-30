import { Form, Section, SectionType } from 'models/form';
import { useFormContext } from 'react-hook-form';
import { closeAddSectionModal } from './section-form-modal';
import { useSectionFormContext } from './section-form-modal.context';

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

export function useAddSection() {
  const addSectionContext = useSectionFormContext();
  const formContext = useFormContext<Form>();

  return (section: Section) => {
    let sections = formContext.getValues('sections');

    if (addSectionContext.mode === 'edit') {
      sections = sections.map((s) => (s.id === section.id ? section : s));
    } else {
      sections = [...sections, { ...section, id: crypto.randomUUID() }];
    }

    formContext.setValue('sections', sections);
    closeAddSectionModal();
  };
}
