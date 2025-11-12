import { env } from 'config';
import { Form } from 'models/form';
import { getAccessToken } from './access-token';
import { SectionDto } from './section';
import { AnswerDto } from './answer';

export interface FormDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  email: string;
  title: string;
  description: string;
  responseCount: number | null;
  location: string;
  coverImage: string;
}

interface FormStats {
  totalResponses: number;
  completedResponses: number;
}

export interface AnswersByFormDto {
  sections: SectionDto[];
  answers: AnswerDto[];
}

export interface CreateFormDto extends Omit<Form, 'coverImage'> {
  coverImage: string;
}

export interface UpdateFormDto extends Omit<Form, 'coverImage'> {
  coverImage: string;
}

export async function getForms(): Promise<FormDto[]> {
  try {
    const { token } = await getAccessToken();

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
    const { token } = await getAccessToken();

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

export async function createForm(form: CreateFormDto): Promise<FormDto | null> {
  try {
    const { token } = await getAccessToken();

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

export async function updateForm(
  formId: string,
  form: UpdateFormDto,
): Promise<boolean> {
  try {
    const { token } = await getAccessToken();

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
    const { token } = await getAccessToken();

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

export async function getAnswersByFormId(
  formId: string,
): Promise<AnswersByFormDto | null> {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/form/${formId}/answers`, {
      headers: {
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
