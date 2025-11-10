import { Drawer } from 'components/drawer';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Product Page',
  description: 'Discover our product offerings.',
});

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        <h1>Product Page</h1>
      </div>
    </Drawer>
  );
}
