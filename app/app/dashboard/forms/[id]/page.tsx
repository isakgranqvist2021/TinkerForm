import { ResponseProvider } from './response-modal';
import { ContentContainer, MainContainer } from 'containers/containers';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';
import { getMetadata } from 'utils';
import { getFormById } from 'services/api/forms';
import { FormActions } from './actions';
import { getSubscription } from 'services/api/subscription';
import { ResponsesTable } from './responses-table';
import { getMyTeam } from 'services/api/team';
import { FormStats } from './form-stats';

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

  const subscription = await getSubscription(session);
  const team = await getMyTeam(session);

  const viewFormHref = `${process.env.APP_BASE_URL}/forms/${team?.id}/${form.id}`;

  return (
    <MainContainer>
      <ResponseProvider>
        <ContentContainer>
          <div className="flex justify-between">
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <Link href="/dashboard/forms">Forms</Link>
                </li>
                <li>
                  <Link href={`/dashboard/forms/${params.id}`}>
                    {form.title}
                  </Link>
                </li>
              </ul>
            </div>

            <FormActions
              viewFormHref={viewFormHref}
              formId={form.id}
              pausedAt={form.pausedAt}
              packageId={subscription?.packageId}
            />
          </div>

          <img
            src={form.coverImage}
            className="w-full h-72 object-cover rounded-md"
            alt="Cover image"
          />

          <FormStats formId={form.id} />

          <ResponsesTable subscription={subscription} formId={form.id} />
        </ContentContainer>
      </ResponseProvider>
    </MainContainer>
  );
}
