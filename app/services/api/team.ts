import { SessionData } from '@auth0/nextjs-auth0/types';
import { env } from 'config';

export async function createTeam(session: SessionData) {
  try {
    const res = await fetch(`${env.API_URL}/team`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}
