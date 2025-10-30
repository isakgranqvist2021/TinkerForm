import React from 'react';
import { Section, TextSection, textSectionSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledTextarea,
} from 'components/inputs';
import { useSectionFormContext } from './section-form-modal.context';
import {
  closeAddSectionModal,
  SectionFormModalProps,
} from './section-form-modal';

interface FormSectionProps extends SectionFormModalProps {
  defaultValues: TextSection;
}

export function Forms(props: SectionFormModalProps) {
  const addSectionContext = useSectionFormContext();

  switch (addSectionContext.defaultValues.type) {
    case 'text':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
        />
      );
  }
}

function TextForm(props: FormSectionProps) {
  const form = useForm<TextSection>({
    resolver: zodResolver(textSectionSchema),
    defaultValues: props.defaultValues,
  });

  React.useEffect(() => {
    form.reset(props.defaultValues);
  }, [props.defaultValues, form]);

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmit(data);
    form.reset(props.defaultValues);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <ControlledInput name="title" label="Section Title *" />
        <ControlledTextarea name="description" label="Describe your section" />

        <div className="flex gap-4">
          <ControlledInput
            type="number"
            name="minLength"
            label="Answer minimum length"
          />
          <ControlledInput
            type="number"
            name="maxLength"
            label="Answer maximum length"
          />
        </div>

        <ControlledCheckbox
          name="required"
          label="This question must be answered"
        />

        <SectionFormModalFooter />
      </form>
    </FormProvider>
  );
}

function SectionFormModalFooter() {
  return (
    <div className="modal-action">
      <button type="button" className="btn" onClick={closeAddSectionModal}>
        Close
      </button>

      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </div>
  );
}
