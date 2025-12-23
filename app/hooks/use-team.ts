import { UpdateTeam } from 'models/team';
import { TeamDto } from 'services/api/team';
import useSWR from 'swr';
import useMutation from 'swr/mutation';

export function useTeam() {
  return useSWR('/api/proxy/team', async (url): Promise<TeamDto> => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Team not found');
    }

    const data = await res.json();

    return data;
  });
}

export function useUpdateTeam() {
  const mutation = useMutation(
    '/api/team',
    async (url, { arg }: { arg: UpdateTeam }) => {
      const formData = new FormData();

      if (arg.coverImage) {
        formData.set('coverImage', arg.coverImage);
      }

      const res = await fetch(url, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Could update team');
      }

      return true;
    },
    {
      onError: () => {},
      onSuccess: () => {},
    },
  );

  return {
    isLoading: mutation.isMutating,
    updateTeam: mutation.trigger,
  };
}
