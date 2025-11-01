import { db } from 'db/db';
import { Answer, answerTable } from 'db/schema';

function insertMany(
  formId: string,
  responseId: string,
  answers: [string, Answer][],
) {
  const values = answers.map(([sectionId, answer]) => ({
    fk_form_id: formId,
    fk_section_id: sectionId,
    answer,
    fk_response_id: responseId,
  }));

  return db.insert(answerTable).values(values).execute();
}

export const AnswersTable = {
  insertMany,
};
