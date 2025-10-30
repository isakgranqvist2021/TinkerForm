'use client';

import { SectionFormModal } from 'components/section-form-modal/section-form-modal';
import { SectionFormProvider } from 'components/section-form-modal/section-form-modal.context';
import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';

const defaultValues: Form = {
  title: '',
  description: '',
  sections: [],
};

export function AddNewForm() {
  const form = useForm<Form>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const sections = form.watch('sections.0');

  const submitForm = form.handleSubmit(async (data) => {
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
    <FormProvider {...form}>
      <SectionFormProvider>
        <FormDetails />

        <SectionsList />

        <button
          disabled={!sections || form.formState.isSubmitting}
          className="btn btn-primary ml-auto"
          onClick={submitForm}
        >
          Create Form
        </button>

        <SectionFormModal />
      </SectionFormProvider>
    </FormProvider>
  );
}
