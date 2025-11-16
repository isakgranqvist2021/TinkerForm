import { expect, test } from 'vitest';
import {
  getCompletionRate,
  calculateDuration,
  formatDuration,
  percentageChange,
  calculateAverageCompletionTime,
  formatMonthlyChange,
  formatScore,
  cn,
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

test('percentageChange', () => {
  expect(percentageChange(150, 100)).toBe(50);
  expect(percentageChange(50, 100)).toBe(-50);
  expect(percentageChange(0, 0)).toBe(0);
  expect(percentageChange(100, 0)).toBe(100);
});

test('formatMonthlyChange', () => {
  expect(formatMonthlyChange(25)).toBe('25% more than last month');
  expect(formatMonthlyChange(25.67)).toBe('25.67% more than last month');
  expect(formatMonthlyChange(-45)).toBe('45% less than last month');
  expect(formatMonthlyChange(-45.89)).toBe('45.89% less than last month');
  expect(formatMonthlyChange(0)).toBe('No change from last month');
  expect(formatMonthlyChange(-0)).toBe('No change from last month');
});

test('formatScore', () => {
  expect(formatScore(0.5)).toBe('50.0%');
  expect(formatScore(0)).toBe('0.0%');
});

test('cn', () => {
  expect(cn('text-xl', 'text-primary')).toBe('text-xl text-primary');
  expect(cn('text-xl', { 'text-primary': false })).toBe('text-xl');
  expect(cn('text-xl', { 'text-primary': true })).toBe('text-xl text-primary');
  expect(cn('text-primary text-primary')).toBe('text-primary');
  expect(cn('text-2xl text-3xl')).toBe('text-3xl');
});
