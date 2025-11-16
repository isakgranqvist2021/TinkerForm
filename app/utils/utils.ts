import currency from 'currency.js';
import dayjs from 'dayjs';
import Dayjs from 'dayjs';
import { Form } from 'models/form';
import { Metadata } from 'next';
import { AnswerDto } from 'services/api/answer';
import { AnswersByFormDto } from 'services/api/forms';
import { ResponseDto } from 'services/api/response';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function formatCurrency(value: number) {
  return currency(value / 100).format({ symbol: '€' });
}

export function formatDate(date: Dayjs.ConfigType) {
  return Dayjs(date).format('MMM DD YYYY HH:mm');
}

export function calculateDuration(
  createdAt: dayjs.ConfigType,
  completedAt: dayjs.ConfigType,
) {
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

export function getDurations(responses: ResponseDto[]) {
  return responses.reduce((acc, response) => {
    const duration = calculateDuration(
      response.createdAt,
      response.completedAt,
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

export function getMetadata(options: {
  title: string;
  description: string;
}): Metadata {
  const metadata = {
    title: `TinkerForm - ${options.title}`,
    description: options.description,
  };

  return metadata;
}

export function formatExportFormData(responses: AnswersByFormDto): string {
  const answers: Record<string, AnswerDto[]> = {};

  responses.answers.forEach((answer) => {
    if (answers[answer.fkResponseId]) {
      answers[answer.fkResponseId].push(answer);
    } else {
      answers[answer.fkResponseId] = [answer];
    }
  });

  const columns = responses.sections.map((section) => section.title);
  const values = Object.values(answers).map((answer) =>
    answer.map(
      (answer) =>
        answer.answerText ??
        answer.answerNumber?.toString() ??
        answer.answerBoolean?.toString() ??
        answer.answerFile ??
        '',
    ),
  );

  let csvData = columns.join(',') + '\r\n';

  values.forEach((value) => {
    csvData += value.join(',') + '\r\n';
  });

  return csvData;
}

export function formatFormValues(form: Form) {
  const formData = new FormData();
  for (const key in form) {
    const value = form[key as keyof typeof form];
    if (value instanceof File || typeof value === 'string') {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  }
  return formData;
}

export function parseFormFormData(formData: FormData) {
  const values: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      values[key] = value;
    } else {
      try {
        values[key] = JSON.parse(value);
      } catch {
        values[key] = value;
      }
    }
  });

  return values;
}

export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], filename, { type: blob.type });
}

export function formatNumber(value?: number, fallback: string = '0'): string {
  if (!value) {
    return fallback;
  }

  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return value.toString();
}

export function percentageChange(a: number, b: number) {
  if (b === 0) {
    return a === 0 ? 0 : 100;
  }

  if (a === b) {
    return 0;
  }

  const changePercentage = parseFloat((((a - b) / b) * 100).toFixed(1));

  return changePercentage;
}

export function formatMonthlyChange(changePercentage: number) {
  if (changePercentage > 0) {
    return `${changePercentage}% more than last month`;
  }

  if (changePercentage < 0) {
    return `${Math.abs(changePercentage)}% less than last month`;
  }

  return `No change from last month`;
}

export function formatScore(score: number) {
  return `${(score * 100).toFixed(1)}%`;
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
