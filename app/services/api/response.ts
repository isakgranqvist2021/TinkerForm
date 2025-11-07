import { env } from 'config';
import { AnswerDto } from './answer';
import { SectionDto } from './section';
import { auth0 } from 'lib/auth0';

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
}

export async function getAnswersByResponseId(
  responseId: string,
): Promise<AnswersByResponseIdDto[]> {
  try {
    const { token } = await auth0.getAccessToken();

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
