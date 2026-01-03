'use client';

import { Form, formSchema } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatFormValues } from 'utils';
import React from 'react';
import { SectionFormProvider } from 'components/sections-list';
import useMutation from 'swr/mutation';
import { FormSections } from 'components/form-sections';
import {
  openPreviewFormModal,
  PreviewFormModal,
} from 'components/preview-form';

interface EditFormProps {
  defaultValues: Form;
  formId: string;
  coverImageUrl: string;
}

export function EditForm(props: EditFormProps) {
  const form = useForm<Form>({
    defaultValues: props.defaultValues,
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation(
    `/api/forms/${props.formId}`,
    async (url, { arg }: { arg: FormData }) => {
      const res = await fetch(url, {
        method: 'PATCH',
        body: arg,
      });

      if (!res.ok) {
        throw new Error('Failed to save form');
      }

      return res.ok;
    },
    {
      onSuccess: () => {
        toast.success('Form saved successfully!');
      },
      onError: () => {
        toast.error("Couldn't save form. Please try again.");
      },
    },
  );

  const submitForm = form.handleSubmit(async (data) => {
    const formData = formatFormValues(data);
    formData.set(
      'sections',
      JSON.stringify(
        data.sections.map((section, i) => ({
          ...section,
          index: i,
        })),
      ),
    );

    await mutation.trigger(formData);
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
            Save Form
          </button>
        </div>
      </SectionFormProvider>
    </FormProvider>
  );
}
