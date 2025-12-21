import { SessionData } from '@auth0/nextjs-auth0/types';
import { env } from 'config';
import { FormDto } from './forms';

export interface TeamDto {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;

  title: string | null;
  description: string | null;
}

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

export async function getActiveFormsByTeamId(id: string): Promise<FormDto[]> {
  try {
    const res = await fetch(`${env.API_URL}/team/${id}/forms`);

    const result = await res.json();
    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getTeam(id: string): Promise<TeamDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/team/${id}`);

    const result = await res.json();
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}
