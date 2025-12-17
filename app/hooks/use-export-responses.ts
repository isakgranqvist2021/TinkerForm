import useMutation from 'swr/mutation';
import { toast } from 'sonner';

export function useExportData(formId: string) {
  return useMutation(
    `/api/forms/${formId}/export`,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Could not load data');
      }

      return res;
    },
    {
      onSuccess: (res) => {
        res.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${formId}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        });
      },
      onError: () => {
        toast.error("Couldn't export form data. Please try again.");
      },
    },
  );
}
