'use client';

import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { formatDateInput, formatFormValues } from 'utils';
import { defaultTheme } from 'config/theme';
import { SectionFormProvider } from 'components/sections-list';
import useMutation from 'swr/mutation';
import { FormSections } from 'components/form-sections';
import {
  openPreviewFormModal,
  PreviewFormModal,
} from 'components/preview-form';

const defaultValues: Form = {
  coverImage: '',
  title: '',
  description: '',
  location: '',
  sections: [],
  theme: defaultTheme,
  startDate: formatDateInput(new Date()),
  endDate: formatDateInput(new Date()),
  availability: 'always',
  maxResponses: 0,
};

export function AddNewForm() {
  const router = useRouter();

  const form = useForm<Form>({
    defaultValues: defaultValues,
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation(
    '/api/forms/new',
    async (url, { arg }: { arg: FormData }): Promise<string> => {
      const res = await fetch(url, {
        method: 'POST',
        body: arg,
      });

      if (!res.ok) {
        throw new Error('Failed to create form');
      }

      const createdForm = await res.json();

      return createdForm.id;
    },
    {
      onSuccess: (id) => {
        router.push(`/dashboard/forms/${id}`);
        toast.success('Form created successfully!');
      },
      onError: () => {
        toast.error("Couldn't create form. Please try again.");
      },
    },
  );

  const submitForm = form.handleSubmit(async (data) => {
    await mutation.trigger(formatFormValues(data));
  });

  return (
    <FormProvider {...form}>
      <PreviewFormModal />

      <SectionFormProvider>
        <FormSections />

        <div className="flex gap-4 justify-end sm:mr-6 pb-6">
          <button className="btn btn-neutral" onClick={openPreviewFormModal}>
            Preview Form
          </button>

          <button
            disabled={form.formState.isSubmitting}
            className="btn btn-primary"
            onClick={submitForm}
          >
            Create Form
          </button>
        </div>
      </SectionFormProvider>
    </FormProvider>
  );
}
