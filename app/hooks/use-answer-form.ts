import { ConstructedSchema } from 'models/answer-form';
import React from 'react';
import { toast } from 'sonner';
import useMutation from 'swr/mutation';

interface UseAnswerFormProps {
  isCompleted: boolean;
  formId: string;
  responseId: string;
}

export function useAnswerForm(props: UseAnswerFormProps) {
  const [hasResponded, setHasResponded] = React.useState(props.isCompleted);

  const mutation = useMutation(
    `/api/form/${props.formId}/${props.responseId}`,
    async (url, arg: { arg: ConstructedSchema }) => {
      const data = arg.arg;

      const formData = new FormData();
      for (const key in data) {
        const value = data[key as keyof typeof data];
        if (value instanceof File || typeof value === 'string') {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to save form');
      }
    },
    {
      onSuccess: () => {
        setHasResponded(true);

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      },
      onError: () => {
        toast.error("Couldn't save form. Please try again.");
      },
    },
  );

  return {
    ...mutation,
    hasResponded,
  };
}
