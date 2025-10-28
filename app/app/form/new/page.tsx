import React from 'react';
import { AddSectionModal } from 'components/add-section-modal/add-section-modal';

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
