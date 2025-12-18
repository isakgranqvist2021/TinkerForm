import useMutation from 'swr/mutation';
import { toast } from 'sonner';

export function useCancelSubscription() {
  const { isMutating, trigger } = useMutation(
    '/api/subscription',
    async (url) => {
      const res = await fetch(url, { method: 'PATCH' });

      if (!res.ok) {
        throw new Error('Could not cancel subscription');
      }
    },
    {
      onSuccess: () => window.location.reload(),
      onError: () => {
        toast.error("Couldn't cancel subscription. Please try again.");
      },
    },
  );

  return { isMutating, trigger };
}
