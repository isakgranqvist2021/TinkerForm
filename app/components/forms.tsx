import React from 'react';
import {
  booleanSectionSchema,
  emailSectionSchema,
  fileSectionSchema,
  linkSectionSchema,
  phoneSectionSchema,
  rangeSectionSchema,
  Section,
  SectionType,
  textSectionSchema,
} from 'models/form';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledTextarea,
} from 'components/inputs';
import {
  closeAddSectionModal,
  SectionFormModalProps,
  useSectionFormContext,
} from './section-form-modal';
import z from 'zod';

interface FormSectionProps extends SectionFormModalProps {
  defaultValues: FieldValues;
  schema: z.ZodObject<any>;

  titlePlaceholder: string;
  descriptionPlaceholder: string;
}

export function Forms(props: SectionFormModalProps) {
  const addSectionContext = useSectionFormContext();

  switch (addSectionContext.defaultValues.type) {
    case 'text':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={textSectionSchema}
          titlePlaceholder="Ex: What is your favorite programming language?"
          descriptionPlaceholder="Ex: Please provide a detailed answer explaining why you like this language."
        />
      );

    case 'link':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={linkSectionSchema}
          titlePlaceholder="Ex: What is your portfolio link?"
          descriptionPlaceholder="Ex: Please provide the URL to your online portfolio."
        />
      );

    case 'email':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={emailSectionSchema}
          titlePlaceholder="Ex: What is your email address?"
          descriptionPlaceholder="Ex: Please provide a valid email address."
        />
      );

    case 'phone':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={phoneSectionSchema}
          titlePlaceholder="Ex: What is your phone number?"
          descriptionPlaceholder="Ex: Please provide your contact phone number."
        />
      );

    case 'file':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={fileSectionSchema}
          titlePlaceholder="Ex: Please upload your resume."
          descriptionPlaceholder="Ex: Upload a PDF or Word document of your resume."
        />
      );

    case 'boolean':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={booleanSectionSchema}
          titlePlaceholder="Ex: Do you agree to the terms and conditions?"
          descriptionPlaceholder="Ex: Please confirm your agreement by selecting yes or no."
        />
      );

    case 'range':
      return (
        <TextForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={rangeSectionSchema}
          titlePlaceholder="Ex: On a scale of 1 to 10, how would you rate your proficiency in JavaScript?"
          descriptionPlaceholder="Ex: Please provide a number between 1 and 10 to indicate your skill level."
        />
      );
  }
}

function TextForm(props: FormSectionProps) {
  const form = useForm({
    resolver: zodResolver(props.schema),
    defaultValues: props.defaultValues,
  });

  React.useEffect(() => {
    form.reset(props.defaultValues);
  }, [props.defaultValues, form]);

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmit(data as Section);
    form.reset(props.defaultValues);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <ControlledInput
          name="title"
          label="Section Title"
          placeholder={props.titlePlaceholder}
        />
        <ControlledTextarea
          name="description"
          label="Describe your section"
          placeholder={props.descriptionPlaceholder}
        />

        <ExtraFields type={props.defaultValues.type as SectionType} />

        <ControlledCheckbox
          name="required"
          label="This question must be answered"
        />

        <SectionFormModalFooter />
      </form>
    </FormProvider>
  );
}

interface ExtraFieldsProps {
  type: SectionType;
}
function ExtraFields(props: ExtraFieldsProps) {
  switch (props.type) {
    case 'boolean':
    case 'email':
    case 'file':
    case 'link':
    case 'phone':
      return null;

    case 'range':
    case 'text':
      return (
        <div className="flex gap-4">
          <ControlledInput name="min" label="Minimum value" type="number" />
          <ControlledInput name="max" label="Maximum value" type="number" />
        </div>
      );
  }
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
