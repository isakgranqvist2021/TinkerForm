import { AddSectionModal } from 'components/add-section-modal/add-section-modal';
import { AddSectionProvider } from 'components/add-section-modal/add-section-modal.context';
import { SectionsList } from 'components/add-section-modal/sections-list';
import React from 'react';

export const metadata = {
  title: 'New Form',
};

export default async function NewForm() {
  return (
    <section className="container mx-auto px-2 py-8 gap-4 flex flex-col">
      <AddSectionProvider defaultValue={[]}>
        <AddSectionModal />

        <SectionsList />

        <button className="btn btn-primary ml-auto">Continue</button>
      </AddSectionProvider>
    </section>
  );
}
