import { db } from 'db/db';
import { responseTable } from 'db/schema';
import { and, count, eq, isNotNull } from 'drizzle-orm';

async function insertOne(formId: string) {
  const responses = await db
    .insert(responseTable)
    .values({
      fk_form_id: formId,
    })
    .returning()
    .execute();

  return responses[0];
}

async function updateCompletedAt(responseId: string) {
  return db
    .update(responseTable)
    .set({ completed_at: new Date() })
    .where(eq(responseTable.id, responseId))
    .execute();
}

async function countByFormId(formId: string) {
  const result = await db
    .select({ count: count(responseTable.id) })
    .from(responseTable)
    .where(eq(responseTable.fk_form_id, formId));

  return Number(result[0].count);
}

async function countCompletedByFormId(formId: string) {
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

function listByFormId(formId: string) {
  return db
    .select()
    .from(responseTable)
    .where(eq(responseTable.fk_form_id, formId));
}

export const ResponseTable = {
  insertOne,
  updateCompletedAt,
  countByFormId,
  countCompletedByFormId,
  listByFormId,
};
