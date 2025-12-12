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
import useMutation from 'swr/mutation';

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
