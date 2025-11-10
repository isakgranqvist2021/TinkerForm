import { PackageCards } from 'components/package-cards';
import { PageTitle } from 'components/page-title';
import dayjs from 'dayjs';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import { getSubscription } from 'services/api/subscription';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Billing',
  description: 'Manage your billing and subscription details.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const subscription = await getSubscription();

  let title = 'Choose a Plan';
  let subtitle =
    'You do not have an active subscription. Choose a plan below to get started.';

  if (subscription?.packageId) {
    title = 'Change Plan';
    subtitle = `${subscription.nextPaymentDate ? `Your next payment date is ${dayjs(subscription.nextPaymentDate).format('MMMM D, YYYY')}. ` : ''}You can change your plan below.`;
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-12 flex flex-col gap-10 flex-grow">
      <div className="mb-4">
        <PageTitle className="text-center mb-2">{title}</PageTitle>
        <p className="text-center">{subtitle}</p>
      </div>

      <PackageCards activePackageId={subscription?.packageId} />
    </div>
  );
}
