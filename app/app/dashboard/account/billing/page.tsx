import { PackageCards } from 'components/package-cards';
import dayjs from 'dayjs';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import { getSubscriptionInfo } from 'utils/utils.server';

export const metadata = {
  title: 'Billing',
};

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const { nextPaymentDate, packageId } = await getSubscriptionInfo();

  return (
    <section className="container mx-auto px-2 py-8">
      <div className="max-w-6xl mx-auto w-full px-4 py-12 flex flex-col gap-10 flex-grow">
        <div>
          {packageId ? (
            <React.Fragment>
              <h1 className="text-4xl font-bold text-center mb-2">
                Change Plan
              </h1>
              <p className="text-center max-w-prose mx-auto mb-4">
                {nextPaymentDate && (
                  <React.Fragment>
                    {' '}
                    Your next payment date is{' '}
                    {dayjs(nextPaymentDate).format('MMMM D, YYYY')}.
                  </React.Fragment>
                )}{' '}
                You can change your plan below.
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h1 className="text-4xl font-bold text-center mb-2">
                Choose a Plan
              </h1>
              <p className="text-center max-w-prose mx-auto mb-4">
                You do not have an active subscription. Choose a plan below to
                get started.
              </p>
            </React.Fragment>
          )}
        </div>

        <PackageCards activePackageId={packageId} />
      </div>
    </section>
  );
}
