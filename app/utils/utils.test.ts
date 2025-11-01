import { expect, test } from 'vitest';
import {
  getCompletionRate,
  calculateDuration,
  formatDuration,
  calculateAverageCompletionTime,
} from './utils';

test('getCompletionRate', () => {
  expect(getCompletionRate(10, 10)).toBe('100.00');
});

test('calculateDuration', () => {
  const createdAt = new Date('2023-01-01T00:00:00Z');
  const completedAt = new Date('2023-01-01T00:01:40Z'); // 100 seconds later

  expect(calculateDuration(createdAt, completedAt)).toBe(100);
  expect(calculateDuration(createdAt, null)).toBe(null);
});

test('formatDuration', () => {
  expect(formatDuration(45)).toBe('45s');
  expect(formatDuration(120)).toBe('2m');
  expect(formatDuration(125)).toBe('2m 5s');
});

test('calculateAverageCompletionTime', () => {
  expect(calculateAverageCompletionTime([60, 120, 180])).toBe('2m');
  expect(calculateAverageCompletionTime([])).toBe(null);
  expect(calculateAverageCompletionTime([60, 120, 180, 240])).toBe('2m 30s');
});
