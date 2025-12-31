import useSWR from 'swr';

interface FormStats {
  totalResponses: number;
  completedResponses: number;
}

export function useFormStats(formId: string) {
  return useSWR(
    `/api/proxy/form/${formId}/stats`,
    async (url): Promise<FormStats> => {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Form stats not found');
      }

      const data = await res.json();

      return data;
    },
  );
}
