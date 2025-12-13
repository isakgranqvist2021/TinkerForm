import { env } from 'config';
import { Form } from 'models/form';
import { SectionDto } from './section';
import { AnswerDto } from './answer';
import { Theme } from 'config/theme';
import { SessionData } from '@auth0/nextjs-auth0/types';

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

  theme: Theme | null;

  availability: 'always' | 'dates' | 'responses';
  startDate: string;
  endDate: string;
  maxResponses: number;
}

export interface FormWithAnswersDto {
  id: string;
  title: string;
  location: string;
  description: string;
  responses: {
    responseId: string;
    answers: {
      question: string;
      answer: string;
      metadata: string | null;
    }[];
  }[];
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

export async function createForm(
  form: CreateFormDto,
  session: SessionData,
): Promise<FormDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
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
  session: SessionData,
): Promise<boolean> {
  try {
    const res = await fetch(`${env.API_URL}/form/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
      body: JSON.stringify(form),
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getFormStats(
  formId: string,
  session: SessionData,
): Promise<FormStats> {
  try {
    const res = await fetch(`${env.API_URL}/form/${formId}/stats`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
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
  session: SessionData,
): Promise<AnswersByFormDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/form/${formId}/answers`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getFormWithAnswers(
  formId: string,
  session: SessionData,
): Promise<FormWithAnswersDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/form/${formId}/with-answers`, {
      headers: {
        Authorization: `Bearer ${session.tokenSet.accessToken}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getResponseCount(formId: string) {
  return 0;
}
