import React from 'react';
import { ControlledInput, ControlledTextarea } from './inputs';
import { SectionsList } from './sections-list';

export function FormDetails() {
  return (
    <React.Fragment>
      <div>
        <h3 className="text-lg font-bold mb-2">1. Form Details</h3>
        <ControlledInput name="title" label="Title" />
        <ControlledTextarea name="description" label="Description" />
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold">2. Sections</h3>
          <p>
            Add sections to your form, and drag to reorder them as you like.
          </p>
        </div>

        <SectionsList />
      </div>
    </React.Fragment>
  );
}
