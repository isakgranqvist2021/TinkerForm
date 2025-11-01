import { db } from 'db/db';
import { formTable } from 'db/schema';
import { and, eq } from 'drizzle-orm';
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
  return db.select().from(formTable).where(eq(formTable.email, email));
}

function insertOne(form: Form, email: string) {
  return db
    .insert(formTable)
    .values({
      email,
      title: form.title,
      description: form.description,
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
