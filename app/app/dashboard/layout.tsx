import { Footer } from 'components/footer';
import { Nav } from 'components/nav';
import { NoSubscriptionBanner } from 'components/no-subscription-banner';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout(props: React.PropsWithChildren) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="max-w-7xl mx-auto w-full flex-grow">
        <NoSubscriptionBanner />

        {props.children}
      </div>

      <Footer />
    </div>
  );
}
