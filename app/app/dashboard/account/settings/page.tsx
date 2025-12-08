import { PageTitle } from 'components/page-title';
import { MainContainer } from 'containers/main-container';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Account Settings',
  description: 'Manage your account settings and preferences.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <PageTitle>Account Settings</PageTitle>

      <p>Email: {session.user.email}</p>
    </MainContainer>
  );
}
