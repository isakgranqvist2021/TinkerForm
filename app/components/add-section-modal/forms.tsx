import React from 'react';
import { TextSection, textSectionSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledTextarea,
} from 'components/inputs';
import { AddSectionModalFooter } from './add-section-modal-footer';
import { useAddSectionContext } from './add-section-modal.context';

export function Forms() {
  const addSectionContext = useAddSectionContext();

  switch (addSectionContext.defaultValues.type) {
    case 'text':
      return <TextForm defaultValues={addSectionContext.defaultValues} />;
  }
}

function TextForm(props: { defaultValues: TextSection }) {
  const addSectionContext = useAddSectionContext();

  const form = useForm<TextSection>({
    resolver: zodResolver(textSectionSchema),
    defaultValues: props.defaultValues,
  });

  React.useEffect(() => {
    form.reset(props.defaultValues);
  }, [props.defaultValues, form]);

  const handleSubmit = form.handleSubmit((data) => {
    addSectionContext.addSection(data);
    form.reset(props.defaultValues);
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
