import { env } from 'config';
import { AnswerDto } from './answer';
import { SectionDto } from './section';
import { getAccessToken } from './access-token';
import { ScoreResponse } from 'models/score-response';

export interface AnswersByResponseIdDto {
  answer: AnswerDto;
  section: SectionDto;
}

export interface ResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  fkFormId: string;

  completedAt: string | null;

  score: number | null;
  reasoning: string | null;
}

export async function getAnswersByResponseId(
  responseId: string,
): Promise<AnswersByResponseIdDto[]> {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/response/${responseId}/answers`, {
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

export async function getResponseById(
  responseId: string,
): Promise<ResponseDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/response/${responseId}`);

    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createResponse(
  fkFormId: string,
): Promise<ResponseDto | null> {
  try {
    const res = await fetch(`${env.API_URL}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fkFormId }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getResponsesByFormId(
  formId: string,
): Promise<ResponseDto[]> {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/response/form/${formId}`, {
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

export async function completeResponse(responseId: string): Promise<boolean> {
  try {
    const res = await fetch(`${env.API_URL}/response/${responseId}/complete`, {
      method: 'PUT',
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function updateResponseScoreAndReasoning(
  scoreResponses: ScoreResponse[],
): Promise<boolean> {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/response/score`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scoreResponses),
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}
