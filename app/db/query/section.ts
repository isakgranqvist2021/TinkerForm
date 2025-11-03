import { db } from 'db/db';
import { InsertSection, sectionTable, SelectedSection } from 'db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { Form, Section } from 'models/form';

async function upsertMany(formId: string, sections: Section[]) {
  const currentSections = await listByFormId(formId);

  // if a section is in sections but not in currentSections, create it
  // if a section is in both, update it
  // if a section is in currentSections but not in sections, delete it

  const sectionsToCreate: Section[] = [];
  const sectionsToUpdate: Section[] = [];
  const sectionsToDelete: SelectedSection[] = [];

  for (const section of sections) {
    const existingSection = currentSections.find((s) => s.id === section.id);
    if (existingSection) {
      sectionsToUpdate.push(section);
    } else {
      sectionsToCreate.push(section);
    }
  }

  for (const currentSection of currentSections) {
    const exists = sections.find((s) => s.id === currentSection.id);
    if (!exists) {
      sectionsToDelete.push(currentSection);
    }
  }

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
