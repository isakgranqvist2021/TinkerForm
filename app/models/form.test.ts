import { expect, test } from 'vitest';
import { fileSchema } from './form';

test('empty file', () => {
  const parseResult = fileSchema.safeParse(new File([], ''));
  console.log(parseResult);
  expect(parseResult.error).toBeDefined();
});
