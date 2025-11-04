import { auth0 } from 'lib/auth0';

export interface FormDto {
  id: string;
  email: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  responseCount: number;
  location: string;
}

export async function getForms(): Promise<FormDto[]> {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return [];
  }

  return fetch(`${process.env.API_URL}/form`, {
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
    return null;
  }

  return fetch(`${process.env.API_URL}/form/${formId}`, {
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
