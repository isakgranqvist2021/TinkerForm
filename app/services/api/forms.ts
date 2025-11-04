import { USE_EXTERNAL_API } from 'config';
import { FormTable } from 'db/query/form';
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

  if (USE_EXTERNAL_API) {
    return fetch(`${process.env.API_URL}/form`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
    }).then((res) => res.json());
  }

  const forms = await FormTable.listByEmail(session.user.email);

  return forms.map((form) => ({
    id: form.id,
    email: form.email,
    title: form.title,
    description: form.description,
    createdAt: form.created_at.toISOString(),
    updatedAt: form.updated_at.toISOString(),
    responseCount: Number(form.response_count),
    location: form.location,
  }));
}

export async function getFormById(formId: string): Promise<FormDto | null> {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return null;
  }

  if (USE_EXTERNAL_API) {
    return fetch(`${process.env.API_URL}/form/${formId}`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
    }).then((res) => res.json());
  }

  const form = await FormTable.findById(formId);
  if (!form) {
    return null;
  }

  return {
    id: form.id,
    email: form.email,
    title: form.title,
    description: form.description,
    createdAt: form.created_at.toISOString(),
    updatedAt: form.updated_at.toISOString(),
    responseCount: Number(form.response_count),
    location: form.location,
  };
}
