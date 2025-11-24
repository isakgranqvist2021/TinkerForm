'use client';

import { Form, formSchema } from 'models/form';
import { FormProvider, useForm, UseFormSetValue } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatFormValues, urlToFile } from 'utils';
import { getDownloadUrl } from '@vercel/blob';
import React from 'react';
import { FormDetails } from 'components/form-details';
import { SectionsList, SectionFormProvider } from 'components/sections-list';

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

  useInjectCoverImage(props.coverImageUrl, form.setValue);

  const submitForm = form.handleSubmit(async (data) => {
    try {
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

      const res = await fetch(`/api/forms/${props.formId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to save form');
      }

      toast.success('Form saved successfully!');
    } catch (error) {
      toast.error("Couldn't save form. Please try again.");
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
          Save Form
        </button>
      </SectionFormProvider>
    </FormProvider>
  );
}

function useInjectCoverImage(url: string, setValue: UseFormSetValue<Form>) {
  const injectFile = React.useCallback(async () => {
    const downloadUrl = getDownloadUrl(url);
    const file = await urlToFile(downloadUrl, 'cover-image');

    setValue('coverImage', file);
  }, [url, setValue]);

  React.useEffect(() => {
    injectFile();
  }, [injectFile]);
}
