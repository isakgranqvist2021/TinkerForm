import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import React from 'react';
import { useSWRConfig } from 'swr';
import { FormDto } from 'services/api/forms';

function usePatchFormListItem(formId: string) {
  const config = useSWRConfig();

  return (patch: Partial<FormDto>) => {
    config.mutate(
      '/api/proxy/form',
      (currentData: FormDto[] | undefined) =>
        currentData?.map((form) =>
          form.id === formId ? { ...form, ...patch } : form,
        ),
      { revalidate: false },
    );
  };
}

export function usePauseForm(formId: string, pausedAt: string | null) {
  const [isPaused, setIsPaused] = React.useState(Boolean(pausedAt));

  const patchFormListItem = usePatchFormListItem(formId);

  const mutation = useMutation(
    `/api/proxy/form/${formId}/pause`,
    async (url): Promise<string> => {
      setIsPaused((isPaused) => !isPaused);

      const res = await fetch(url, { method: 'PATCH' });

      if (!res.ok) {
        throw new Error('Could not pause form');
      }

      const data = await res.text();

      patchFormListItem({ pausedAt: data || null });

      return data;
    },
    {
      onError: () => {
        toast.error('Error pausing form');
      },
      onSuccess: (pausedAt) => {
        if (pausedAt) {
          toast.success('Form paused', {
            description: 'Users will no longer be able to answer this form',
          });
        } else {
          toast.success('Form resumed', {
            description: 'Users can now answer this form',
          });
        }
      },
    },
  );

  return {
    isPaused,
    isLoading: mutation.isMutating,
    pauseForm: () => mutation.trigger(),
  };
}
