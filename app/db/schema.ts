import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';

const defaultColumns = {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
};

const fk_form_id = uuid('fk_form_id')
  .references(() => formTable.id, { onDelete: 'cascade' })
  .notNull();

export type SelectedForm = InferSelectModel<typeof formTable>;
export const formTable = pgTable('form', {
  ...defaultColumns,
  email: varchar('email', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 10000 }).notNull(),
  location: varchar('location', { length: 500 }).notNull(),
});

export type InsertSection = InferInsertModel<typeof sectionTable>;
export type SelectedSection = InferSelectModel<typeof sectionTable>;
export const sectionTable = pgTable('section', {
  ...defaultColumns,
  fk_form_id,
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  index: integer('index').notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  required: boolean('required').default(false),
  min: integer('min'),
  max: integer('max'),
});

export type SelectedResponse = InferSelectModel<typeof responseTable>;
export const responseTable = pgTable('response', {
  ...defaultColumns,
  fk_form_id,
  completed_at: timestamp('completed_at'),
});

export type InsertAnswer = InferInsertModel<typeof answerTable>;
export type SelectedAnswer = InferSelectModel<typeof answerTable>;
export const answerTable = pgTable('answer', {
  ...defaultColumns,
  fk_form_id,
  fk_response_id: uuid('fk_response_id')
    .references(() => responseTable.id, { onDelete: 'cascade' })
    .notNull(),
  fk_section_id: uuid('fk_section_id')
    .references(() => sectionTable.id, { onDelete: 'cascade' })
    .notNull(),

  answer_text: varchar('answer_text', { length: 2000 }),
  answer_number: integer('answer_number'),
  answer_boolean: boolean('answer_boolean'),
  answer_file: varchar('answer_file', { length: 500 }),
});
