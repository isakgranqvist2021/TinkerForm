import { db } from 'db/db';
import {
  InsertMultipleChoiceOption,
  InsertSection,
  multipleChoiceOptionTable,
  sectionTable,
  SelectedSection,
} from 'db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { Section } from 'models/form';

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
    await insertMany(sectionsToCreate, formId);
  }
}

function getSection(section: Section, formId: string): InsertSection {
  switch (section.type) {
    case 'boolean':
    case 'email':
    case 'file':
    case 'link':
    case 'phone':
    case 'multiple-choice':
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
    .select({
      created_at: sectionTable.created_at,
      id: sectionTable.id,
      updated_at: sectionTable.updated_at,
      fk_form_id: sectionTable.fk_form_id,
      type: sectionTable.type,
      title: sectionTable.title,
      index: sectionTable.index,
      description: sectionTable.description,
      required: sectionTable.required,
      min: sectionTable.min,
      max: sectionTable.max,
      options: sql`CASE
        WHEN ${sectionTable.type} = 'multiple-choice' THEN
          NULLIF(
            jsonb_agg(
              jsonb_build_object(
                'id', ${multipleChoiceOptionTable.id},
                'text', ${multipleChoiceOptionTable.text},
                'fk_section_id', ${multipleChoiceOptionTable.fk_section_id}
              )
            ) FILTER (WHERE ${multipleChoiceOptionTable.id} IS NOT NULL),
            '[]'::jsonb
          )
        ELSE NULL
      END`,
    })
    .from(sectionTable)
    .leftJoin(
      multipleChoiceOptionTable,
      eq(sectionTable.id, multipleChoiceOptionTable.fk_section_id),
    )
    .where(eq(sectionTable.fk_form_id, formId))
    .groupBy(
      sectionTable.id,
      sectionTable.created_at,
      sectionTable.updated_at,
      sectionTable.fk_form_id,
      sectionTable.type,
      sectionTable.title,
      sectionTable.index,
      sectionTable.description,
      sectionTable.required,
      sectionTable.min,
      sectionTable.max,
    ) as Promise<SelectedSection[]>;
}

async function insertMany(sections: Section[], formId: string) {
  const options: InsertMultipleChoiceOption[] = [];

  const values = sections.map((section): InsertSection => {
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

      case 'multiple-choice':
        const id = crypto.randomUUID();

        for (let i = 0; i < section.options.length; i++) {
          options.push({
            fk_section_id: id,
            text: section.options[i].text,
          });
        }

        return {
          id,
          fk_form_id: formId,
          type: section.type,
          title: section.title,
          index: section.index,
          description: section.description,
          required: section.required,
          min: null,
          max: null,
        };
    }
  });

  const result = await db
    .insert(sectionTable)
    .values(values)
    .returning()
    .execute();

  if (options.length > 0) {
    await db.insert(multipleChoiceOptionTable).values(options).execute();
  }

  return result;
}

export const SectionTable = {
  insertMany,
  listByFormId,
  upsertMany,
};
