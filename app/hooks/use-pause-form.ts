import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import React from 'react';

export function usePauseForm(formId: string, pausedAt: string | null) {
  const [isPaused, setIsPaused] = React.useState(Boolean(pausedAt));

  const mutation = useMutation(
    `/api/proxy/form/${formId}/pause`,
    async (url): Promise<string> => {
      setIsPaused((isPaused) => !isPaused);

      const res = await fetch(url, { method: 'PATCH' });

      if (!res.ok) {
        throw new Error('Could not pause form');
      }

      const data = await res.text();

      return data;
    },
    {
      onError: () => {
        toast.error('Error pausing form');
      },
      onSuccess: (pausedAt) => {
        toast.success(
          pausedAt ? 'Form paused successfully' : 'Form resumed successfully',
        );
      },
    },
  );

  return {
    isPaused,
    isLoading: mutation.isMutating,
    pauseForm: () => mutation.trigger(),
  };
}
