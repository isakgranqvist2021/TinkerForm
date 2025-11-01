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
              <p>{averageCompletionTime ?? 'N/A'}</p>
            </div>
          </div>

          <div className="card card-border bg-base-100 w-96">
            <div className="card-body">
              <h2 className="card-title">Completion Rate</h2>
              <p>{completionRate}%</p>
            </div>
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
