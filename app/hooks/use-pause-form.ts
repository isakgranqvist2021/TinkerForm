import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';

export function usePauseForm(formId: string) {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const mutation = useMutation(
    `/api/proxy/form/${formId}/pause`,
    async (url): Promise<string> => {
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
        mutate('/api/proxy/form');
        router.refresh();

        if (pausedAt) {
          toast.success('Form paused successfully');
        } else {
          toast.success('Form resumed successfully');
        }
      },
    },
  );

  return {
    isLoading: mutation.isMutating,
    pauseForm: () => mutation.trigger(),
  };
}
