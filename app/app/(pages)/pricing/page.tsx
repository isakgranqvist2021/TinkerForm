import { Drawer } from 'components/drawer';
import { PackageCards } from 'components/package-cards';
import { PageTitle } from 'components/page-title';
import Link from 'next/link';
import { getSubscription } from 'services/api/subscription';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Pricing',
  description: 'Choose the plan that best fits your needs.',
});

export default async function Page() {
  const subscription = await getSubscription();

  return (
    <Drawer>
      <div className="max-w-7xl mx-auto w-full px-4 py-12 flex flex-col gap-10 flex-grow">
        <div className="mb-4">
          <PageTitle className="text-center mb-2">Pricing</PageTitle>
          <p className="text-center">
            Choose the plan that best fits your needs.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <PackageCards activePackageId={subscription?.packageId} />

          <Link href="/support" className="text-center link">
            Contact Support
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
