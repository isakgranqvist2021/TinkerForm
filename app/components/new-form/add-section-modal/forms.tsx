import React from 'react';
import {
  Section,
  TextSection,
  textSectionSchema,
} from './add-section-modal.types';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledTextarea,
} from 'components/inputs';
import { AddSectionModalFooter } from './add-section-modal-footer';

interface FormsProps {
  defaultValues: Section;
}
export function Forms(props: FormsProps) {
  switch (props.defaultValues.type) {
    case 'text':
      return <TextForm defaultValues={props.defaultValues} />;
  }
}

function TextForm(props: { defaultValues: TextSection }) {
  const form = useForm<TextSection>({
    resolver: zodResolver(textSectionSchema),
    defaultValues: props.defaultValues,
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <ControlledInput name="title" label="Section Title" />
        <ControlledTextarea name="description" label="Describe your section" />

        <div className="flex gap-4">
          <ControlledInput type="number" name="minLength" label="Min length" />
          <ControlledInput type="number" name="maxLength" label="Max length" />
        </div>

        <ControlledCheckbox name="required" label="Is required?" />

        <AddSectionModalFooter />
      </form>
    </FormProvider>
  );
}
