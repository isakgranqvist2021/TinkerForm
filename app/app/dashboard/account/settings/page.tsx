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
    <section className="container mx-auto px-2 py-8">
      <h1>Account</h1>

      <p>Email: {session.user.email}</p>
    </section>
  );
}
