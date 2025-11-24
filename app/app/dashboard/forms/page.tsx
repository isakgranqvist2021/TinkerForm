import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';
import { MainContainer } from 'containers/main-container';
import { redirect } from 'next/navigation';
import { EmptyState } from 'components/empty-state';
import { getForms, type FormDto } from 'services/api/forms';
import {
  formatMonthlyChange,
  formatNumber,
  getMetadata,
  percentageChange,
} from 'utils';

import { getFormStats } from 'services/api/stats';
import { DeleteFormIconButton, DeleteFormModal } from './[id]/actions';

export const metadata = getMetadata({
  title: 'My Forms',
  description: 'Manage and create your forms.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const forms = await getForms();
  const formStats = await getFormStats();

  return (
    <MainContainer>
      <div className="flex gap-4 justify-between">
        <div className="flex justify-between">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/dashboard/forms">Forms</Link>
              </li>
            </ul>
          </div>
        </div>

        {forms.length > 0 && (
          <div className="tooltip" data-tip="New Form">
            <Link href="/dashboard/forms/new" className="btn btn-circle">
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
          </div>
        )}
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
            {formatNumber(formStats?.currentMonth.totalResponses)}
          </div>
          <div className="stat-desc">
            {formatMonthlyChange(
              percentageChange(
                formStats?.currentMonth.totalResponses || 0,
                formStats?.previousMonth.totalResponses || 0,
              ),
            )}
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
            {formatNumber(formStats?.currentMonth.completedResponses)}
          </div>
          <div className="stat-desc">
            {formatMonthlyChange(
              percentageChange(
                formStats?.currentMonth.completedResponses || 0,
                formStats?.previousMonth.completedResponses || 0,
              ),
            )}
          </div>
        </div>
      </div>

      {forms.length ? (
        <ul className="list bg-base-100 rounded-box shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            My forms
          </li>

          {forms.map(renderFormListItem)}
        </ul>
      ) : (
        <EmptyState
          title="You have no forms yet."
          subtitle="Create your first form to start collecting responses."
          cta={
            <Link href="/dashboard/forms/new" className="btn btn-outline mb-4">
              New Form
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
          }
        />
      )}
    </MainContainer>
  );
}

function renderFormListItem(form: FormDto) {
  const responseCount = Number(form.responseCount ?? 0);

  return (
    <li key={form.id} className="list-row justify-between flex w-full p-0">
      <Link
        href={`/dashboard/forms/${form.id}`}
        className="flex-grow p-4 hover:underline"
      >
        <div>
          <div>{form.title}</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            {responseCount === 0
              ? 'No responses'
              : responseCount === 1
                ? '1 response'
                : `${responseCount} responses`}
          </div>
        </div>
      </Link>

      <div className="flex p-4">
        <div className="tooltip" data-tip="Edit">
          <Link
            className="btn btn-square btn-ghost"
            href={`/dashboard/forms/${form.id}/edit`}
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
        <DeleteFormIconButton formId={form.id} />
        <DeleteFormModal formId={form.id} />
      </div>
    </li>
  );
}
