import React from 'react';
import { ControlledInput, ControlledTextarea } from './inputs';
import { useFormState } from 'react-hook-form';

export function FormDetails() {
  const formState = useFormState();

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
