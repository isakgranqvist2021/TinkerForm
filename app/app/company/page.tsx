import { Drawer } from 'components/drawer';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Company',
  description: 'Learn more about TinkerForm as a company.',
});

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        <h1>Company Page</h1>
      </div>
    </Drawer>
  );
}
