import currency from 'currency.js';
import dayjs from 'dayjs';
import Dayjs from 'dayjs';
import { Metadata } from 'next';
import { AnswersByFormDto } from 'services/api/forms';
import { AnswersByResponseIdDto, ResponseDto } from 'services/api/response';

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

export function formatExportFormData(responses: AnswersByFormDto[]): string {
  responses.forEach((response) => {
    console.log(response.section);
    console.log(response.answers);
  });
  // const users = [
  //   { name: 'Patricia', surname: 'Smith', age: null },
  //   { name: 'John', surname: null, age: 56 },
  //   { name: 'Maria', surname: 'Brown', age: 37 },
  // ];

  // let csvData = ['name', 'surname', 'age'].join(',') + '\r\n';

  // responses.forEach((response) => {
  //   csvData += [user.name, user.surname, user.age].join(',') + '\r\n';
  // });

  // return csvData;

  return '';
}
