'use client';

import { SectionFormProvider } from './section-form-modal';
import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';
import { useRouter } from 'next/navigation';

const defaultValues: Form = {
  title: '',
  description: '',
  sections: [
    {
      id: crypto.randomUUID(),
      type: 'text',
      index: 0,
      description: 'Please enter your legal name.',
      title: 'Your name',
      required: true,
    },
    {
      id: crypto.randomUUID(),
      type: 'email',
      index: 1,
      description: 'Please enter your personal email address.',
      title: 'Your email',
      required: true,
    },
    {
      id: crypto.randomUUID(),
      type: 'phone',
      index: 2,
      description: 'Please enter your phone number.',
      title: 'Your phone number',
      required: false,
    },
    {
      id: crypto.randomUUID(),
      type: 'link',
      index: 3,
      description: 'Please enter the link to your LinkedIn profile.',
      title: 'LinkedIn profile',
      required: true,
    },
  ],
};

export function AddNewForm() {
  const router = useRouter();

  const form = useForm<Form>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

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
