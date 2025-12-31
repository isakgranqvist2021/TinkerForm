import { ResponseDto } from 'services/api/response';
import useSWR from 'swr';

export function useResponses(formId: string) {
  return useSWR(
    `/api/proxy/response/form/${formId}`,
    async (url): Promise<ResponseDto[]> => {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Responses not found');
      }

      const data = await res.json();

      return data;
    },
  );
}
