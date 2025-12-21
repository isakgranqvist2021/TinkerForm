import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';
import { MainContainer } from 'containers/main-container';
import { redirect } from 'next/navigation';
import { getMetadata } from 'utils';

import { FormsList, NewFormButton } from './forms-list';
import { FormStats } from './form-stats';
import { TeamFormsButton } from 'components/team-forms-button';

export const metadata = getMetadata({
  title: 'My Forms',
  description: 'Manage and create your forms.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

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

        <div className="flex gap-4">
          <TeamFormsButton />
          <NewFormButton />
        </div>
      </div>

      <FormStats />

      <FormsList />
    </MainContainer>
  );
}
