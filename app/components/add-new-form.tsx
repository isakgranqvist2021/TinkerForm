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
    {
      id: crypto.randomUUID(),
      type: 'file',
      index: 4,
      description: 'Please upload your resume/CV.',
      title: 'Resume/CV',
      required: true,
    },
  ],
};

const placeholders = [
  {
    title: 'Sales Representative',
    description:
      "We're looking for a skilled sales representative to join our team and help drive revenue growth through effective client engagement and relationship management.",
  },
  {
    title: 'Customer Support Specialist',
    description:
      'Seeking a dedicated customer support specialist to provide exceptional service and resolve client issues efficiently, ensuring high customer satisfaction.',
  },
  {
    title: 'Marketing Coordinator',
    description:
      'Hiring a creative marketing coordinator to assist in the development and execution of marketing campaigns, social media management, and event planning.',
  },
  {
    title: 'Software Engineer',
    description:
      'Looking for a talented software engineer to design, develop, and maintain high-quality software solutions that meet user needs and business goals.',
  },
  {
    title: 'Product Manager',
    description:
      'Seeking an experienced product manager to lead cross-functional teams in the development and launch of innovative products that drive business success.',
  },
];

const randomIndex = Math.floor(Math.random() * placeholders.length);
const randomPlaceholder = placeholders[randomIndex];

export function AddNewForm() {
  const router = useRouter();

  const form = useForm<Form>({
    defaultValues: { ...defaultValues, ...randomPlaceholder },
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
