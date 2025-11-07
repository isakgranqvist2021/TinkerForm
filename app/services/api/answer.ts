import { env } from 'config';

export interface AnswerDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  fkFormId: string;
  fkResponseId: string;
  fkSectionId: string | null;

  answerText: string | null;
  answerNumber: number | null;
  answerBoolean: boolean | null;
  answerFile: string | null;
}

export interface CreateAnswerDto {
  fkResponseId: string;
  fkFormId: string;
  fkSectionId: string;
  answerText: string | null;
  answerNumber: number | null;
  answerBoolean: boolean | null;
  answerFile: string | null;
}

export async function createAnswers(answers: CreateAnswerDto[]) {
  try {
    await fetch(`${env.API_URL}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });
  } catch (err) {
    console.error(err);
  }
}
