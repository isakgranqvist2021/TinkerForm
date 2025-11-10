import { Drawer } from 'components/drawer';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'About Us',
  description: 'Learn more about TinkerForm and our mission.',
});

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        <h1>About Us</h1>
      </div>
    </Drawer>
  );
}
