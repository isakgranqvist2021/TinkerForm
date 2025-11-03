import { db } from 'db/db';
import { InsertAnswer, answerTable, sectionTable } from 'db/schema';
import { eq } from 'drizzle-orm';

function insertMany(answers: InsertAnswer[]) {
  return db.insert(answerTable).values(answers).execute();
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
