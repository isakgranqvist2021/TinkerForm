import { AddNewForm } from 'components/add-new-form';
import { MainContainer } from 'containers/main-container';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'New Form',
  description: 'Create a new form to collect responses.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard/forms">Forms</Link>
          </li>
          <li>
            <Link href="/dashboard/forms/new">New</Link>
          </li>
        </ul>
      </div>

      <AddNewForm />
    </MainContainer>
  );
}
