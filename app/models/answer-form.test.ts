import { expect, test } from 'vitest';
import * as clientSchema from './answer-form';
import * as serverSchema from './answer-form';
import { Section } from './form';

test('getSchema (optional with empty string)', () => {
  const payload: Section = {
    description: 'Please provide your feedback.',
    id: 'section-1',
    index: 0,
    max: 500,
    min: 10,
    required: false,
    title: 'Feedback',
    type: 'text',
  };

  expect(clientSchema.getSchema(payload).safeParse('').error).toBeUndefined();
  expect(serverSchema.getSchema(payload).safeParse('').error).toBeUndefined();
});

test('getSchema (optinal with empty string)', () => {
  const payload: Section = {
    type: 'text',
    description: 'Please explain your reason for applying',
    id: 'e6d8e732-fdf2-494c-b9d0-1fb333c56620',
    index: 1,
    required: false,
    title: 'What is your reason for applying?',
    min: 1,
    max: 5000,
  };

  expect(clientSchema.getSchema(payload).safeParse('').error).toBeUndefined();
  expect(serverSchema.getSchema(payload).safeParse('').error).toBeUndefined();
});

test('getSchema (required with empty string)', () => {
  const payload: Section = {
    type: 'text',
    description: 'Please explain your reason for applying',
    id: 'e6d8e732-fdf2-494c-b9d0-1fb333c56620',
    index: 1,
    required: true,
    title: 'What is your reason for applying?',
    min: 1,
    max: 5000,
  };

  expect(clientSchema.getSchema(payload).safeParse('').error).toBeDefined();
  expect(serverSchema.getSchema(payload).safeParse('').error).toBeDefined();
});

test('getSchema (required with valid string)', () => {
  const payload: Section = {
    type: 'text',
    description: 'Please explain your reason for applying',
    id: 'e6d8e732-fdf2-494c-b9d0-1fb333c56620',
    index: 1,
    required: true,
    title: 'What is your reason for applying?',
    min: 1,
    max: 5000,
  };

  expect(
    clientSchema.getSchema(payload).safeParse('Some value').error,
  ).toBeUndefined();
  expect(
    serverSchema.getSchema(payload).safeParse('Some value').error,
  ).toBeUndefined();
});

test('getSchema (required with without string)', () => {
  const payload: Section = {
    type: 'text',
    description: 'Please explain your reason for applying',
    id: 'e6d8e732-fdf2-494c-b9d0-1fb333c56620',
    index: 1,
    required: true,
    title: 'What is your reason for applying?',
    min: 1,
    max: 5000,
  };

  expect(clientSchema.getSchema(payload).safeParse('').error).toBeDefined();
  expect(serverSchema.getSchema(payload).safeParse('').error).toBeDefined();
});
