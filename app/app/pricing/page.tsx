import { Drawer } from 'components/drawer';
import { PackageCards } from 'components/package-cards';

export const metadata = {
  title: 'Pricing - TinkerForm',
  description: 'Choose the best plan that fits your needs.',
};

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-5xl mx-auto w-full px-4 py-12 flex flex-col gap-10 flex-grow">
        <h1 className="text-4xl font-bold text-center">Pricing</h1>

        <PackageCards />
      </div>
    </Drawer>
  );
}
