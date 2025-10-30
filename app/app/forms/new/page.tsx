import { AddNewForm } from 'components/add-new-form';
import { MainContainer } from 'containers/main-container';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'New Form',
};

export default async function Page() {
  return (
    <MainContainer>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/forms">Forms</Link>
          </li>
          <li>
            <Link href="/forms/new">New</Link>
          </li>
        </ul>
      </div>

      <AddNewForm />
    </MainContainer>
  );
}
