import { TeamDto } from 'services/api/team';
import useSWR from 'swr';

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
