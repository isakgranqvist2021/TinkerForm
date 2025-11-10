import { PackageCards } from 'components/package-cards';
import dayjs from 'dayjs';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import { getMetadata } from 'utils';
import { getSubscriptionInfo } from 'utils/utils.server';

export const metadata = getMetadata({
  title: 'Billing',
  description: 'Manage your billing and subscription details.',
});

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const { nextPaymentDate, packageId } = await getSubscriptionInfo();

  let title = 'Choose a Plan';
  let subtitle =
    'You do not have an active subscription. Choose a plan below to get started.';

  if (packageId) {
    title = 'Change Plan';
    subtitle = `${nextPaymentDate ? `Your next payment date is ${dayjs(nextPaymentDate).format('MMMM D, YYYY')}. ` : ''}You can change your plan below.`;
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-12 flex flex-col gap-10 flex-grow">
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-center mb-2">{title}</h1>
        <p className="text-center">{subtitle}</p>
      </div>

      <PackageCards activePackageId={packageId} />
    </div>
  );
}
