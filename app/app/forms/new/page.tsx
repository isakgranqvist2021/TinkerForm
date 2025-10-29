import { AddNewForm } from 'components/add-new-form/add-new-form';
import React from 'react';

export const metadata = {
  title: 'New Form',
};

export default async function NewForm() {
  return (
    <section className="container mx-auto px-2 py-8 gap-4 flex flex-col flex-grow">
      <AddNewForm defaultValue={[]} />
    </section>
  );
}
