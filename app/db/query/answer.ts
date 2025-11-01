import { db } from 'db/db';
import { InsertAnswer, answerTable, sectionTable } from 'db/schema';
import { eq } from 'drizzle-orm';

function insertMany(
  formId: string,
  responseId: string,
  answers: [string, InsertAnswer['answer']][],
) {
  const values = answers.map(([sectionId, answer]) => ({
    fk_form_id: formId,
    fk_section_id: sectionId,
    answer,
    fk_response_id: responseId,
  }));

  return db.insert(answerTable).values(values).execute();
}

function findByResponseId(responseId: string) {
  return db
    .select()
    .from(answerTable)
    .where(eq(answerTable.fk_response_id, responseId))
    .leftJoin(sectionTable, eq(answerTable.fk_section_id, sectionTable.id));
}

export const AnswersTable = {
  insertMany,
  findByResponseId,
};
