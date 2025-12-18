import { ResponseProvider } from './response-modal';
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
import { FormActions } from './actions';
import { getSubscription } from 'services/api/subscription';
import { ResponsesTable } from './responses-table';
import { DeleteFormModal } from 'hooks/use-delete-form';
import {
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PercentBadgeIcon,
} from '@heroicons/react/24/outline';

export const generateMetadata = async (props: PageProps<{ id: string }>) => {
  const params = await props.params;
  const form = await getFormById(params.id);

  return getMetadata({
    title: form ? form.title : 'Form Not Found',
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

  const responses = await getResponsesByFormId(params.id, session);
  const formStats = await getFormStats(params.id, session);
  const subscription = await getSubscription(session);

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
            pausedAt={form.pausedAt}
            packageId={subscription?.packageId}
          />
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <EyeIcon className="inline-block h-8 w-8 stroke-current" />
            </div>
            <div className="stat-title">Total Views</div>
            <div className="stat-value text-primary">
              {formatNumber(formStats.totalResponses)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <CheckCircleIcon className="inline-block h-8 w-8 stroke-current" />
            </div>
            <div className="stat-title">Total Responses</div>
            <div className="stat-value text-secondary">
              {formatNumber(formStats.completedResponses)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <ClockIcon className="inline-block h-8 w-8 stroke-current" />
            </div>
            <div className="stat-title">Average Completion Time</div>
            <div className="stat-value text-secondary">
              {averageCompletionTime ?? 'N/A'}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <PercentBadgeIcon className="inline-block h-8 w-8 stroke-current" />
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
