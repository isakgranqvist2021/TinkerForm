import { Drawer } from 'components/drawer';

export const metadata = {
  title: 'Product - TinkerForm',
  description: 'Learn more about our product offerings.',
};

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-5xl mx-auto w-full p-4">
        <h1>Product Page</h1>
      </div>
    </Drawer>
  );
}
