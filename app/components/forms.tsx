import React from 'react';
import {
  EmailSection,
  emailSectionSchema,
  LinkSection,
  linkSectionSchema,
  PhoneSection,
  phoneSectionSchema,
  TextSection,
  textSectionSchema,
} from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
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

interface FormSectionProps<T> extends SectionFormModalProps {
  defaultValues: T;
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

    case 'link':
      return (
        <LinkForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
        />
      );

    case 'email':
      return (
        <EmailForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
        />
      );

    case 'phone':
      return (
        <PhoneForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
        />
      );
  }
}

function TextForm(props: FormSectionProps<TextSection>) {
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
        <ControlledInput
          name="title"
          label="Section Title"
          placeholder="Your name"
        />
        <ControlledTextarea
          name="description"
          label="Describe your section"
          placeholder="Please enter your legal name."
        />

        <ControlledCheckbox
          name="required"
          label="This question must be answered"
        />

        <SectionFormModalFooter />
      </form>
    </FormProvider>
  );
}

function LinkForm(props: FormSectionProps<LinkSection>) {
  const form = useForm<LinkSection>({
    resolver: zodResolver(linkSectionSchema),
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
        <ControlledInput
          name="title"
          label="Section Title"
          placeholder="LinkedIn profile"
        />
        <ControlledTextarea
          name="description"
          label="Describe your section"
          placeholder="Please enter the link to your LinkedIn profile."
        />

        <ControlledCheckbox
          name="required"
          label="This question must be answered"
        />

        <SectionFormModalFooter />
      </form>
    </FormProvider>
  );
}

function EmailForm(props: FormSectionProps<EmailSection>) {
  const form = useForm<EmailSection>({
    resolver: zodResolver(emailSectionSchema),
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
        <ControlledInput
          name="title"
          label="Section Title"
          placeholder="Your email"
        />
        <ControlledTextarea
          name="description"
          label="Describe your section"
          placeholder="Please enter your personal email address."
        />

        <ControlledCheckbox
          name="required"
          label="This question must be answered"
        />

        <SectionFormModalFooter />
      </form>
    </FormProvider>
  );
}

function PhoneForm(props: FormSectionProps<PhoneSection>) {
  const form = useForm<PhoneSection>({
    resolver: zodResolver(phoneSectionSchema),
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
        <ControlledInput
          name="title"
          label="Section Title"
          placeholder="Your phone number"
        />
        <ControlledTextarea
          name="description"
          label="Describe your section"
          placeholder="Please enter your phone number."
        />

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
