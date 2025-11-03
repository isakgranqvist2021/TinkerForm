import { Nav } from 'components/nav';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout(props: React.PropsWithChildren) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <React.Fragment>
      <Nav />

      {props.children}
    </React.Fragment>
  );
}
