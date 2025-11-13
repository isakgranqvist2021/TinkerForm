import { env } from 'process';
import { getAccessToken } from './access-token';

interface StatsDto {
  currentMonth: {
    totalResponses: number;
    completedResponses: number;
  };
  previousMonth: {
    totalResponses: number;
    completedResponses: number;
  };
}

export async function getFormStats(): Promise<StatsDto | null> {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/stats/forms`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
