import { db } from 'db/db';
import { InsertSection, sectionTable } from 'db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { Form, Section } from 'models/form';

async function upsertMany(formId: string, sections: Section[]) {
  const currentSections = await listByFormId(formId);

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
      .set(getSection(section, formId))
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
      .values(sectionsToCreate.map((section) => getSection(section, formId)))
      .execute();
  }
}

function getSection(section: Section, formId: string): InsertSection {
  switch (section.type) {
    case 'boolean':
    case 'email':
    case 'file':
    case 'link':
    case 'phone':
      return {
        fk_form_id: formId,
        type: section.type,
        title: section.title,
        index: section.index,
        description: section.description,
        required: section.required,
        updated_at: new Date(),
        min: null,
        max: null,
      };

    default:
      return {
        fk_form_id: formId,
        type: section.type,
        title: section.title,
        index: section.index,
        description: section.description,
        required: section.required,
        updated_at: new Date(),
        min: section.min,
        max: section.max,
      };
  }
}

function listByFormId(formId: string) {
  return db
    .select()
    .from(sectionTable)
    .where(eq(sectionTable.fk_form_id, formId));
}

function insertMany(form: Form, formId: string) {
  return db
    .insert(sectionTable)
    .values(
      form.sections.map((section) => {
        switch (section.type) {
          case 'email':
          case 'file':
          case 'link':
          case 'phone':
          case 'boolean':
            return {
              fk_form_id: formId,
              type: section.type,
              title: section.title,
              index: section.index,
              description: section.description,
              required: section.required,
            };

          case 'range':
          case 'text':
            return {
              fk_form_id: formId,
              type: section.type,
              title: section.title,
              index: section.index,
              description: section.description,
              required: section.required,
              min: section.min,
              max: section.max,
            };
        }
      }),
    )
    .execute();
}

export const SectionTable = {
  insertMany,
  listByFormId,
  upsertMany,
};
