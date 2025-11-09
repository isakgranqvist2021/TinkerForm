import { CancelSubscriptionButton } from 'components/cancel-subscription-button';
import { PackageCards } from 'components/package-cards';
import { packages } from 'config/packages';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { getSubscription, SubscriptionDto } from 'services/api/subscription';
import { stripe } from 'services/payment';
import Stripe from 'stripe';

export const metadata = {
  title: 'Billing',
};

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const subscription = await getSubscription();

  return (
    <section className="container mx-auto px-2 py-8">
      {subscription ? (
        <div>
          <h1 className="text-4xl font-bold mb-4">Billing</h1>
          <ActiveSubscriptionDetails subscription={subscription} />
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold mb-4 text-center">Choose a Plan</h1>

          <PackageCards />
        </div>
      )}
    </section>
  );
}

interface ActiveSubscriptionDetailsProps {
  subscription: SubscriptionDto;
}

async function ActiveSubscriptionDetails(
  props: ActiveSubscriptionDetailsProps,
) {
  const subscription = await stripe.subscriptions.retrieve(
    props.subscription.subscriptionId,
  );

  return (
    <div>
      <p>Subscription: {packages[props.subscription.packageId].name}</p>
      <p>Status: {formatStatusText(subscription.status)}</p>

      <CancelSubscriptionButton className="btn btn-default mt-4">
        Cancel Subscription
      </CancelSubscriptionButton>
    </div>
  );
}

function formatStatusText(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
      return 'Active';
    case 'unpaid':
      return 'Unpaid';
    case 'canceled':
      return 'Canceled';
    case 'paused':
      return 'Paused';
    case 'incomplete':
      return 'Incomplete';
    case 'incomplete_expired':
      return 'Incomplete Expired';
    case 'past_due':
      return 'Past Due';
    case 'trialing':
      return 'Trialing';
  }
}
