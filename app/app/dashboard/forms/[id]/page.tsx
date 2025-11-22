import { ResponseProvider } from 'components/response-modal';
import { MainContainer } from 'containers/main-container';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';
import {
  calculateAverageCompletionTime,
  formatNumber,
  getCompletionRate,
  getDurations,
  getMetadata,
} from 'utils';
import { getFormById, getFormStats } from 'services/api/forms';
import { getResponsesByFormId } from 'services/api/response';
import { DeleteFormModal, FormActions } from 'components/view-form-actions';
import { ResponsesTable } from 'components/responses-table';
import { getSubscription } from 'services/api/subscription';

export const generateMetadata = async (props: PageProps<{ id: string }>) => {
  const params = await props.params;
  const form = await getFormById(params.id);

  return getMetadata({
    title: form ? `Form - ${form.title}` : 'Form Not Found',
    description: form
      ? `Manage and view responses for the form "${form.title}".`
      : 'The requested form was not found.',
  });
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

  const responses = await getResponsesByFormId(params.id);
  const formStats = await getFormStats(params.id);
  const subscription = await getSubscription();

  const durations = getDurations(responses);
  const averageCompletionTime = calculateAverageCompletionTime(durations);
  const completionRate = getCompletionRate(
    formStats.completedResponses,
    formStats.totalResponses,
  );

  return (
    <ResponseProvider>
      <DeleteFormModal formId={form.id} />

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

          <FormActions
            viewFormHref={`${process.env.APP_BASE_URL}/form/${form.id}`}
            formId={form.id}
          />
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
            <div className="stat-title">Total Views</div>
            <div className="stat-value text-primary">
              {formatNumber(formStats.totalResponses)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
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
            <div className="stat-title">Total Responses</div>
            <div className="stat-value text-secondary">
              {formatNumber(formStats.completedResponses)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
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
            <div className="stat-figure text-secondary">
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
            <div className="stat-value">{completionRate}%</div>
          </div>
        </div>

        <ResponsesTable
          subscription={subscription}
          formId={form.id}
          responses={responses}
        />
      </MainContainer>
    </ResponseProvider>
  );
}
