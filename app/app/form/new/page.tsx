import { AddSectionModal } from 'components/new-form/add-section-modal/add-section-modal';
import React from 'react';

export const metadata = {
  title: 'New Form',
};

export default async function NewForm() {
  return (
    <section className="container mx-auto px-2 py-8">
      <AddSectionModal />
    </section>
  );
}
