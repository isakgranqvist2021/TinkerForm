import { CopyFormLink } from 'components/copy-form-link';
import { DeleteFormIconButton } from 'components/delete-form-button';
import { MainContainer } from 'containers/main-container';
import dayjs from 'dayjs';

import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';
import { formatDate } from 'utils';

export const metadata = {
  title: 'Form',
};

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const form = await FormTable.findFormById(params.id);
  if (!form || form.email !== session.user.email) {
    return redirect('/404');
  }

  const responses = await ResponseTable.listResponsesByFormId(params.id);
  const responsesCount = await ResponseTable.countResponsesByFormId(params.id);
  const completedResponsesCount =
    await ResponseTable.countCompletedResponsesByFormId(params.id);

  const completionRate = (
    (completedResponsesCount / responsesCount) *
    100
  ).toFixed(2);

  const averageCompletionTime = 0;

  return (
    <MainContainer>
      <div className="flex justify-between">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/dashboard/forms">Forms</Link>
            </li>
            <li>
              <Link href={`/dashboard/forms/${params.id}`}>{form.title}</Link>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <CopyFormLink formId={params.id} />

          <DeleteFormIconButton className="btn btn-circle" formId={params.id} />

          <div className="tooltip" data-tip="Edit">
            <Link
              className="btn btn-circle"
              href={`/dashboard/forms/${params.id}/edit`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="card card-border bg-base-100 w-96">
          <div className="card-body">
            <h2 className="card-title">Responses</h2>
            <p>{responsesCount}</p>
          </div>
        </div>

        <div className="card card-border bg-base-100 w-96">
          <div className="card-body">
            <h2 className="card-title">Average Completion Time</h2>
            <p>{averageCompletionTime}</p>
          </div>
        </div>

        <div className="card card-border bg-base-100 w-96">
          <div className="card-body">
            <h2 className="card-title">Completion Rate</h2>
            <p>{completionRate}%</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Completion Time</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((responses, index) => {
              const duration = calculateDuration(
                responses.created_at,
                responses.completed_at,
              );

              return (
                <tr key={responses.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(responses.created_at)}</td>
                  <td>{duration ? formatDuration(duration) : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MainContainer>
  );
}

function calculateDuration(createdAt: Date, completedAt: Date | null) {
  if (!completedAt) {
    return null;
  }

  const duration = {
    minutes: 0,
    seconds: 0,
  };

  const diff = dayjs(completedAt).diff(dayjs(createdAt), 'second');

  duration.minutes = Math.floor(diff / 60);
  duration.seconds = diff % 60;

  return duration;
}

function formatDuration(
  duration: NonNullable<ReturnType<typeof calculateDuration>>,
) {
  if (duration.minutes === 0) {
    return `${duration.seconds}s`;
  }

  if (duration.seconds === 0) {
    return `${duration.minutes}m`;
  }

  return `${duration.minutes}m ${duration.seconds}s`;
}
