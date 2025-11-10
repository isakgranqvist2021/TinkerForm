import { Drawer } from 'components/drawer';
import { PackageCards } from 'components/package-cards';
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
      <div className="max-w-6xl mx-auto w-full px-4 py-12 flex flex-col gap-10 flex-grow">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-center mb-2">Pricing</h1>
          <p className="text-center">
            Choose the plan that best fits your needs.
          </p>
        </div>

        <PackageCards activePackageId={subscription?.packageId} />
      </div>
    </Drawer>
  );
}
