'use client';

import {
  openAddSectionModal,
  SectionFormModal,
} from 'components/section-form-modal/section-form-modal';
import {
  SectionFormProvider,
  useSectionFormContext,
} from 'components/section-form-modal/section-form-modal.context';
import { Form, formSchema } from 'models/form';
import { SectionsList } from 'components/add-new-form/sections-list';
import { ControlledInput, ControlledTextarea } from 'components/inputs';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSectionDefaultValues } from 'components/section-form-modal/section-form-modal.utils';

export interface AddNewFormProps {
  defaultValues: Form;
}

export function AddNewForm(props: AddNewFormProps) {
  const form = useForm<Form>({
    defaultValues: props.defaultValues,
    resolver: zodResolver(formSchema),
  });

  const sections = form.watch('sections');

  return (
    <FormProvider {...form}>
      <SectionFormProvider defaultValues={props.defaultValues}>
        <ControlledInput name="title" label="Title" />
        <ControlledTextarea name="description" label="Description" />

        {sections.length > 0 ? (
          <AddSectionButton className="btn btn-secondary ml-auto" />
        ) : (
          <div className="bg-base-200 text-center flex flex-col items-center p-6 rounded flex-grow justify-center">
            <p className="mb-4 text-lg font-bold">No sections added yet.</p>
            <AddSectionButton className="btn btn-secondary" />
          </div>
        )}

        <SectionsList />

        <SubmitFormButton />

        <SectionFormModal />
      </SectionFormProvider>
    </FormProvider>
  );
}

function SubmitFormButton() {
  const formContext = useFormContext<Form>();
  const sections = formContext.watch('sections');

  const submitForm = formContext.handleSubmit(async (data) => {
    try {
      const res = await fetch('/api/forms/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create form');
      }

      toast.success('Form created successfully!');
    } catch (error) {
      toast.error("Couldn't create form. Please try again.");
    }
  });

  return (
    <button
      disabled={!sections.length || formContext.formState.isSubmitting}
      className="btn btn-primary ml-auto"
      onClick={submitForm}
    >
      Create Form
    </button>
  );
}

function AddSectionButton(props: React.ComponentProps<'button'>) {
  const sectionFormContext = useSectionFormContext();

  return (
    <button
      className="btn w-fit"
      onClick={() => {
        openAddSectionModal();
        sectionFormContext.setMode('add');
        sectionFormContext.setDefaultValues(getSectionDefaultValues('text'));
      }}
      {...props}
    >
      Add section
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  );
}
