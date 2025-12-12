'use client';

import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { formatFormValues } from 'utils';
import { defaultTheme } from 'config/theme';
import { FormDetails } from 'components/form-details';
import { SectionsList, SectionFormProvider } from 'components/sections-list';
import useMutation from 'swr/mutation';

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
      <SectionFormProvider>
        <div className="card shadow-sm">
          <div className="card-body">
            <FormDetails />
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <SectionsList />
          </div>
        </div>

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
