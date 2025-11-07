import { ResponseProvider } from 'components/response-modal';
import { CopyFormLink } from 'components/copy-form-link';
import { DeleteFormIconButton } from 'components/delete-form-button';
import { MainContainer } from 'containers/main-container';
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
import { EmptyState } from 'components/empty-state';
import { VisitFormLink } from 'components/view-form-link';
import { getFormById } from 'services/api/forms.server';

export const metadata = {
  title: 'Form',
};

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const form = await getFormById(params.id);
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

  const formLink = `${process.env.APP_BASE_URL}/form/${form.id}`;

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
            <VisitFormLink href={formLink} />

            <CopyFormLink href={formLink} />

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
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div className="stat-title">Views</div>
            <div className="stat-value text-secondary">{responsesCount}</div>
            <div className="stat-desc">
              Number of times your form was viewed
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className="stat-title">Responses</div>
            <div className="stat-value text-secondary">
              {completedResponsesCount}
            </div>
            <div className="stat-desc">
              Number of completed form submissions
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
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className="stat-title">Average Completion Time</div>
            <div className="stat-value text-secondary">
              {averageCompletionTime ?? 'N/A'}
            </div>
            <div className="stat-desc">Average time to complete the form</div>
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
                  d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <div className="stat-title">Completion Rate</div>
            <div className="stat-value text-secondary">{completionRate}%</div>
            <div className="stat-desc">Percentage of completed forms</div>
          </div>
        </div>

        {Boolean(responses.length) ? (
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
        ) : (
          <EmptyState
            title="No responses yet"
            subtitle="When someone fills out your form, the responses will be displayed here."
          />
        )}
      </MainContainer>
    </ResponseProvider>
  );
}
