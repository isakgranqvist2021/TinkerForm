import { db } from 'db/db';
import { responseTable } from 'db/schema';
import { and, count, eq, isNotNull } from 'drizzle-orm';

async function insertReponse(formId: string) {
  const responses = await db
    .insert(responseTable)
    .values({
      fk_form_id: formId,
    })
    .returning()
    .execute();

  return responses[0];
}

async function findResponseById(responseId: string) {
  const responses = await db
    .select()
    .from(responseTable)
    .where(eq(responseTable.id, responseId));

  return responses[0];
}

async function updateResponseCompletedAt(responseId: string) {
  return db
    .update(responseTable)
    .set({ completed_at: new Date() })
    .where(eq(responseTable.id, responseId))
    .execute();
}

async function countResponsesByFormId(formId: string) {
  const result = await db
    .select({ count: count(responseTable.id) })
    .from(responseTable)
    .where(eq(responseTable.fk_form_id, formId));

  return Number(result[0].count);
}

async function countCompletedResponsesByFormId(formId: string) {
  const result = await db
    .select({ count: count(responseTable.id) })
    .from(responseTable)
    .where(
      and(
        eq(responseTable.fk_form_id, formId),
        isNotNull(responseTable.completed_at),
      ),
    );

  return Number(result[0].count);
}

function listResponsesByFormId(formId: string) {
  return db
    .select()
    .from(responseTable)
    .where(eq(responseTable.fk_form_id, formId));
}

export const ResponseTable = {
  insertReponse,
  findResponseById,
  updateResponseCompletedAt,
  countResponsesByFormId,
  countCompletedResponsesByFormId,
  listResponsesByFormId,
};
