import { env } from 'config';
import { AnswerDto } from './answer.server';
import { SectionDto } from './section.server';
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
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return [];
  }

  return fetch(`${env.API_URL}/response/${responseId}/answers`, {
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

export async function getResponseById(
  responseId: string,
): Promise<ResponseDto | null> {
  return fetch(`${env.API_URL}/response/${responseId}`)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
}
