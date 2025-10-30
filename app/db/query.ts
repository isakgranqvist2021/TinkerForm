import { eq, InferSelectModel } from 'drizzle-orm';
import { formTable, sectionTable } from './schema';
import { db } from './db';
import { Form } from 'models/form';

export function listFormsByEmail(email: string) {
  return db.select().from(formTable).where(eq(formTable.email, email));
}

export function insertOneForm(form: Form, email: string) {
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

export function insertManySections(form: Form, formId: string) {
  return db
    .insert(sectionTable)
    .values(
      form.sections.map((section) => ({
        fk_form_id: formId,
        type: section.type,
        title: section.title,
        index: section.index,
        description: section.description,
        required: section.required,
        min_length: Number(section.minLength || 0),
        max_length: Number(section.maxLength || 0),
      })),
    )
    .execute();
}

export async function findFormById(formId: string) {
  const forms = await db
    .select()
    .from(formTable)
    .where(eq(formTable.id, formId));

  return forms[0];
}

export function listSectionsByFormId(formId: string) {
  return db
    .select()
    .from(sectionTable)
    .where(eq(sectionTable.fk_form_id, formId));
}
