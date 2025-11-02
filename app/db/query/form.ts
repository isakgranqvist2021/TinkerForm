import { db } from 'db/db';
import { formTable, responseTable } from 'db/schema';
import { and, count, eq } from 'drizzle-orm';
import { Form } from 'models/form';

async function isOwner(formId: string, email: string) {
  const forms = await db
    .select()
    .from(formTable)
    .where(and(eq(formTable.id, formId), eq(formTable.email, email)));

  if (forms.length === 0) {
    return false;
  }

  return true;
}

function deleteById(formId: string) {
  return db.delete(formTable).where(eq(formTable.id, formId)).execute();
}

function updateById(formId: string, form: Omit<Form, 'sections'>) {
  return db
    .update(formTable)
    .set({
      title: form.title,
      description: form.description,
      updated_at: new Date(),
    })
    .where(eq(formTable.id, formId))
    .execute();
}

async function findById(formId: string) {
  const forms = await db
    .select()
    .from(formTable)
    .where(eq(formTable.id, formId));

  return forms[0];
}

function listByEmail(email: string) {
  return db
    .select({
      id: formTable.id,
      email: formTable.email,
      title: formTable.title,
      description: formTable.description,
      created_at: formTable.created_at,
      updated_at: formTable.updated_at,
      response_count: count(responseTable.completed_at).as('response_count'),
    })
    .from(formTable)
    .leftJoin(responseTable, eq(formTable.id, responseTable.fk_form_id))
    .where(eq(formTable.email, email))
    .groupBy(formTable.id)
    .orderBy(formTable.created_at);
}

function insertOne(form: Form, email: string) {
  return db
    .insert(formTable)
    .values({
      email,
      title: form.title,
      description: form.description,
      location: form.location,
    })
    .returning()
    .execute();
}

export const FormTable = {
  insertOne,
  listByEmail,
  findById,
  updateById,
  deleteById,
  isOwner,
};
