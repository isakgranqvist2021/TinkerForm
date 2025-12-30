import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';
import { ContentContainer, MainContainer } from 'containers/containers';
import { redirect } from 'next/navigation';
import { getMetadata } from 'utils';

import { FormsTable, NewFormButton } from './forms-table';
import { FormStats } from './form-stats';
import { TeamFormsButton } from 'components/team-forms-button';
import { EditTeamSettingsCoverImage } from 'components/edit-team-setings';
import { getMyTeam } from 'services/api/team';

export const metadata = getMetadata({
  title: 'My Forms',
  description: 'Manage and create your forms.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const team = await getMyTeam(session);

  return (
    <React.Fragment>
      <EditTeamSettingsCoverImage coverImage={team?.coverImage} />

      <MainContainer>
        <ContentContainer>
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
              <NewFormButton />
              <TeamFormsButton />
            </div>
          </div>

          <FormStats />

          <FormsTable />
        </ContentContainer>
      </MainContainer>
    </React.Fragment>
  );
}
