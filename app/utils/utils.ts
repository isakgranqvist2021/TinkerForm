import currency from 'currency.js';
import dayjs from 'dayjs';
import Dayjs from 'dayjs';

export function formatCurrency(value: number) {
  return currency(value / 100).format({ symbol: '€' });
}

export function formatDate(date: Dayjs.ConfigType) {
  return Dayjs(date).format('MMM DD YYYY HH:mm');
}

export function calculateDuration(createdAt: Date, completedAt: Date | null) {
  return completedAt
    ? dayjs(completedAt).diff(dayjs(createdAt), 'second')
    : null;
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}

export function calculateAverageCompletionTime(durations: number[]) {
  return durations.length
    ? formatDuration(
        Math.floor(durations.reduce((a, b) => a + b, 0) / durations.length),
      )
    : null;
}

export function getDurations(
  responses: { created_at: Date; completed_at: Date | null }[],
) {
  return responses.reduce((acc, response) => {
    const duration = calculateDuration(
      response.created_at,
      response.completed_at,
    );

    if (duration !== null) {
      acc.push(duration);
    }

    return acc;
  }, [] as number[]);
}

export function getCompletionRate(
  completedResponsesCount: number,
  responsesCount: number,
) {
  const completionRate = (
    (completedResponsesCount / responsesCount) *
    100
  ).toFixed(2);

  return isNaN(Number(completionRate)) ? '0.00' : completionRate;
}
