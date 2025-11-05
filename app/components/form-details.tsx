import React from 'react';
import { ControlledInput, ControlledTextarea } from './inputs';
import { useFormState } from 'react-hook-form';

export function FormDetails() {
  const formState = useFormState();

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-lg font-bold">1. Form Details</h3>
        <p>Describe your form so users know what to expect.</p>
      </div>

      <ControlledInput
        name="title"
        label="Title"
        disabled={formState.isSubmitting}
        placeholder="Software Engineer"
      />

      <ControlledInput
        name="location"
        label="Location"
        disabled={formState.isSubmitting}
        placeholder="San Francisco, CA"
      />

      <ControlledTextarea
        name="description"
        label="Description"
        disabled={formState.isSubmitting}
        rich
      />
    </div>
  );
}
