'use client';

import { SectionFormProvider } from './section-form-modal';
import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';

interface EditFormProps {
  defaultValues: Form;
  formId: string;
}

export function EditForm(props: EditFormProps) {
  const form = useForm<Form>({
    defaultValues: props.defaultValues,
    resolver: zodResolver(formSchema),
  });

  const submitForm = form.handleSubmit(
    async (data) => {
      try {
        const res = await fetch(`/api/forms/${props.formId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            sections: data.sections.map((section, i) => ({
              ...section,
              index: i,
            })),
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to save form');
        }

        toast.success('Form saved successfully!');
      } catch (error) {
        toast.error("Couldn't save form. Please try again.");
      }
    },
    (err) => {
      console.log(err);
    },
  );

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
          Save Form
        </button>
      </SectionFormProvider>
    </FormProvider>
  );
}
