import { ScoreResponse } from 'models/score-response';
import useMutation, { SWRMutationConfiguration } from 'swr/mutation';

export function useScoreResponses(
  formId: string,
  options?: SWRMutationConfiguration<
    Record<string, ScoreResponse>,
    any,
    string
  >,
) {
  return useMutation(
    `/api/forms/${formId}/score`,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to score responses');
      }

      const data = await res.json();

      return data.scores as Record<string, ScoreResponse>;
    },
    options,
  );
}
