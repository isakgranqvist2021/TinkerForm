import { db } from 'db/db';
import { InsertAnswer, answerTable } from 'db/schema';

function insertMany(answers: InsertAnswer[]) {
  return db.insert(answerTable).values(answers).execute();
}

export const AnswersTable = {
  insertMany,
};
