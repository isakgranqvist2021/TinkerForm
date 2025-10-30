import { and, eq } from 'drizzle-orm';
import { inArray } from 'drizzle-orm';
import { formTable, sectionTable } from './schema';
import { db } from './db';
import { Form, Section } from 'models/form';

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

export function deleteFormById(formId: string) {
  return db.delete(formTable).where(eq(formTable.id, formId)).execute();
}

export function updateFormById(formId: string, form: Omit<Form, 'sections'>) {
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

export async function upsertSections(
  formId: string,
  sections: Form['sections'],
) {
  const currentSections = await listSectionsByFormId(formId);

  const currentSectionIds = new Set(
    currentSections.map((section) => section.id),
  );

  const incomingSectionIds = new Set(sections.map((section) => section.id));

  const sectionsToCreate: Section[] = [];
  const sectionsToUpdate: Section[] = [];

  const sectionsToDelete = currentSections.filter(
    (current) => !incomingSectionIds.has(current.id),
  );

  if (sectionsToDelete.length > 0) {
    const idsToDelete = sectionsToDelete.map((section) => section.id);
    await db
      .delete(sectionTable)
      .where(
        and(
          eq(sectionTable.fk_form_id, formId),
          inArray(sectionTable.id, idsToDelete),
        ),
      )
      .execute();
  }

  for (const section of sections) {
    if (section.id && currentSectionIds.has(section.id)) {
      sectionsToUpdate.push(section);
    } else {
      sectionsToCreate.push(section);
    }
  }

  for (const section of sectionsToUpdate) {
    await db
      .update(sectionTable)
      .set({
        type: section.type,
        title: section.title,
        index: section.index,
        description: section.description,
        required: section.required,
        min_length: Number(section.minLength || 0),
        max_length: Number(section.maxLength || 0),
        updated_at: new Date(),
      })
      .where(
        and(
          eq(sectionTable.id, section.id),
          eq(sectionTable.fk_form_id, formId),
        ),
      )
      .execute();
  }

  if (sectionsToCreate.length > 0) {
    await db
      .insert(sectionTable)
      .values(
        sectionsToCreate.map((section) => ({
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
}

export async function isFormOwner(formId: string, email: string) {
  const forms = await db
    .select()
    .from(formTable)
    .where(and(eq(formTable.id, formId), eq(formTable.email, email)));

  if (forms.length === 0) {
    return false;
  }

  return true;
}
