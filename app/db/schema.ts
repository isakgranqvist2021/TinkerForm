import { InferInsertModel } from 'drizzle-orm';
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';

export const formTable = pgTable('form', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  email: varchar('email', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
});

export const sectionTable = pgTable('section', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  fk_form_id: uuid('fk_form_id')
    .references(() => formTable.id, { onDelete: 'cascade' })
    .notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  index: integer('index').notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  required: boolean('required').default(false),
});

export const answerTable = pgTable('answer', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  response_id: uuid('response_id').notNull(),
  fk_form_id: uuid('fk_form_id')
    .references(() => formTable.id, { onDelete: 'cascade' })
    .notNull(),
  fk_section_id: uuid('fk_section_id')
    .references(() => sectionTable.id, { onDelete: 'cascade' })
    .notNull(),
  answer: varchar('answer', { length: 2000 }),
});

export type Answer = InferInsertModel<typeof answerTable>['answer'];
