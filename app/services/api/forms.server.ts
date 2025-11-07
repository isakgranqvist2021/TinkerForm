import { env } from 'config';
import { auth0 } from 'lib/auth0';

export interface FormDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  email: string;
  title: string;
  description: string;
  responseCount: number | null;
  location: string;
}

export async function getForms(): Promise<FormDto[]> {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return [];
  }

  return fetch(`${env.API_URL}/form`, {
    headers: {
      Authorization: `Bearer ${session.tokenSet.accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return [];
    });
}

export async function getFormById(formId: string): Promise<FormDto | null> {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return fetch(`${env.API_URL}/form/${formId}/slim`)
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  return fetch(`${env.API_URL}/form/${formId}`, {
    headers: {
      Authorization: `Bearer ${session.tokenSet.accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export async function deleteFormById(formId: string): Promise<boolean> {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return false;
  }

  return fetch(`${env.API_URL}/form/${formId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.tokenSet.accessToken}`,
    },
  })
    .then((res) => res.ok)
    .catch((err) => {
      console.error(err);
      return false;
    });
}
