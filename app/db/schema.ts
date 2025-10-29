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
  description: varchar('description', { length: 1000 }),
  required: boolean('required').default(false),
  min_length: integer('min_length').default(0),
  max_length: integer('max_length').default(0),
});
