import { UpdateEmailSettings } from 'models/email-settings';
import { toast } from 'sonner';
import useSWR from 'swr';
import useMutation from 'swr/mutation';

export interface EmailSettingsDto {
  id: string;
  email: string;

  createdAt: string;
  updatedAt: string;

  productUpdates: boolean;
  marketing: boolean;
}

export function useUpdateEmailSettings() {
  const mutation = useMutation(
    `/api/proxy/emailsettings`,
    async (url, { arg }: { arg: UpdateEmailSettings }) => {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Could not save email settings');
      }

      return true;
    },
    {
      onError: () => {
        toast.error('Could not save email settings');
      },
      onSuccess: () => {
        toast.success('Email settings saved');
      },
    },
  );

  return {
    isLoading: mutation.isMutating,
    updateEmailSettings: mutation.trigger,
  };
}

export function useEmailSettings() {
  return useSWR(
    `/api/proxy/emailsettings`,
    async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Could not save email settings');
      }

      const settings: EmailSettingsDto | null = await res.json();

      return settings;
    },
    {
      revalidateOnFocus: false,
    },
  );
}
