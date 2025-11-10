import { Drawer } from 'components/drawer';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Support Page',
  description: 'Get help and support for your TinkerForm account.',
});

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        <h1>Support Page</h1>
      </div>
    </Drawer>
  );
}
