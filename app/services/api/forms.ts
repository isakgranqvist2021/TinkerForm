import { env } from 'config';
import { auth0 } from 'lib/auth0';
import { Form } from 'models/form';

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

interface FormStats {
  totalResponses: number;
  completedResponses: number;
}

export async function getForms(): Promise<FormDto[]> {
  try {
    const { token } = await auth0.getAccessToken();

    const res = await fetch(`${env.API_URL}/form`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getFormById(formId: string): Promise<FormDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/form/${formId}`);

    const result = await res.json();
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteForm(formId: string): Promise<boolean> {
  try {
    const { token } = await auth0.getAccessToken();

    const res = await fetch(`${env.API_URL}/form/${formId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function createForm(form: Form): Promise<FormDto | null> {
  try {
    const { token } = await auth0.getAccessToken();

    const res = await fetch(`${env.API_URL}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateForm(formId: string, form: Form): Promise<boolean> {
  try {
    const { token } = await auth0.getAccessToken();

    const res = await fetch(`${env.API_URL}/form/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getFormStats(formId: string): Promise<FormStats> {
  try {
    const { token } = await auth0.getAccessToken();

    const res = await fetch(`${env.API_URL}/form/${formId}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return {
      completedResponses: 0,
      totalResponses: 0,
    };
  }
}
