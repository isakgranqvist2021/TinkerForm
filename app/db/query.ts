import { and, count, eq, isNotNull, isNull } from 'drizzle-orm';
import { inArray } from 'drizzle-orm';
import {
  Answer,
  answerTable,
  formTable,
  responseTable,
  sectionTable,
} from './schema';
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

export function listResponsesByFormId(formId: string) {
  return db
    .select()
    .from(responseTable)
    .where(eq(responseTable.fk_form_id, formId));
}

export async function upsertSections(formId: string, sections: Section[]) {
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
        })),
      )
      .execute();
  }
}

export function insertAnswers(
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

export async function insertReponse(formId: string) {
  const responses = await db
    .insert(responseTable)
    .values({
      fk_form_id: formId,
    })
    .returning()
    .execute();

  return responses[0];
}

export async function findResponseById(responseId: string) {
  const responses = await db
    .select()
    .from(responseTable)
    .where(eq(responseTable.id, responseId));

  return responses[0];
}

export async function updateResponseCompletedAt(responseId: string) {
  return db
    .update(responseTable)
    .set({ completed_at: new Date() })
    .where(eq(responseTable.id, responseId))
    .execute();
}

export async function countResponsesByFormId(formId: string) {
  const result = await db
    .select({ count: count(responseTable.id) })
    .from(responseTable)
    .where(eq(responseTable.fk_form_id, formId));

  return Number(result[0].count);
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
