'use client';

import { SectionFormProvider } from './section-form-modal';
import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';
import { useRouter } from 'next/navigation';
import React from 'react';
import { formatFormValues } from 'utils';
import { defaultTheme } from 'config/theme';

const defaultValues: Form = {
  coverImage: new File([], ''),
  title: '',
  description: '',
  location: '',
  sections: [],
  theme: defaultTheme,
};

export function AddNewForm() {
  const router = useRouter();

  const form = useForm<Form>({
    defaultValues: defaultValues,
    resolver: zodResolver(formSchema),
  });

  const submitForm = form.handleSubmit(async (data) => {
    try {
      const res = await fetch('/api/forms/new', {
        method: 'POST',
        body: formatFormValues(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create form');
      }

      const createdForm = await res.json();

      router.push(`/dashboard/forms/${createdForm.id}`);

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
          disabled={form.formState.isSubmitting}
          className="btn btn-primary ml-auto"
          onClick={submitForm}
        >
          Create Form
        </button>
      </SectionFormProvider>
    </FormProvider>
  );
}
