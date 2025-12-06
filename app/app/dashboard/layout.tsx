import { Footer } from 'components/footer';
import { Nav } from 'components/nav';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import {
  getSubscription,
  SubscriptionDetails,
} from 'services/api/subscription';

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

async function NoSubscriptionBanner() {
  let subscription: SubscriptionDetails | null = null;
  const session = await auth0.getSession();
  if (session) {
    subscription = await getSubscription(session);
  }

  if (subscription?.packageId) {
    return null;
  }

  return (
    <div className="alert alert-warning mt-4 justify-center mx-4">
      You do not have an active subscription. Please choose a plan to get
      started.
      <Link
        href="/dashboard/account/billing"
        className="btn btn-neutral btn-sm"
      >
        Choose a Plan
      </Link>
    </div>
  );
}
