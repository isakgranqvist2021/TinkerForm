import { ResponseProvider } from 'components/response-modal';
import { CopyFormLink } from 'components/copy-form-link';
import { DeleteFormIconButton } from 'components/delete-form-button';
import { MainContainer } from 'containers/main-container';

import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';
import {
  calculateAverageCompletionTime,
  getCompletionRate,
  getDurations,
} from 'utils';
import { ResponseTableRow } from 'components/response-table-row';

export const metadata = {
  title: 'Form',
};

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const form = await FormTable.findById(params.id);
  if (!form || form.email !== session.user.email) {
    return redirect('/404');
  }

  const responses = await ResponseTable.listByFormId(params.id);
  const responsesCount = await ResponseTable.countByFormId(params.id);
  const completedResponsesCount = await ResponseTable.countCompletedByFormId(
    params.id,
  );

  const durations = getDurations(responses);
  const averageCompletionTime = calculateAverageCompletionTime(durations);
  const completionRate = getCompletionRate(
    completedResponsesCount,
    responsesCount,
  );

  return (
    <ResponseProvider>
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

            <DeleteFormIconButton
              className="btn btn-circle"
              formId={params.id}
            />

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

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className="stat-title">Views</div>
            <div className="stat-value text-secondary">{responsesCount}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className="stat-title">Average Completion Time</div>
            <div className="stat-value text-secondary">
              {averageCompletionTime ?? 'N/A'}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
            </div>
            <div className="stat-title">Completion Rate</div>
            <div className="stat-value text-secondary">{completionRate}%</div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Completion Time</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <ResponseTableRow
                  key={response.id}
                  response={response}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </MainContainer>
    </ResponseProvider>
  );
}
