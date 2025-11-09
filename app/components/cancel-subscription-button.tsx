'use client';

import { toast } from 'sonner';
import useMutation from 'swr/mutation';

export function CancelSubscriptionButton(
  props: React.ComponentProps<'button'>,
) {
  const { isMutating, trigger } = useMutation(
    '/api/subscription',
    async (url: string) => {
      await fetch(url, { method: 'PATCH' });
    },
    {
      onSuccess: () => window.location.reload(),
      onError: () => {
        toast.error("Couldn't cancel subscription. Please try again.");
      },
    },
  );

  return <button {...props} disabled={isMutating} onClick={() => trigger()} />;
}
