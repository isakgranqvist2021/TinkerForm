'use client';

import { AddSectionModal } from 'components/add-section-modal/add-section-modal';
import {
  AddSectionProvider,
  useAddSectionContext,
} from 'components/add-section-modal/add-section-modal.context';
import { Section } from 'models/form';
import { SectionsList } from 'components/add-section-modal/sections-list';

interface AddNewFormProps {
  defaultValue: Section[];
}

export function AddNewForm(props: AddNewFormProps) {
  return (
    <AddSectionProvider defaultValue={props.defaultValue}>
      <AddSectionModal />

      <SectionsList />

      <ContinueButton />
    </AddSectionProvider>
  );
}

function ContinueButton() {
  const addSectionContext = useAddSectionContext();

  return (
    <button
      disabled={
        !addSectionContext.sections.length || addSectionContext.isLoading
      }
      className="btn btn-primary ml-auto"
      onClick={addSectionContext.submitForm}
    >
      Continue
    </button>
  );
}
