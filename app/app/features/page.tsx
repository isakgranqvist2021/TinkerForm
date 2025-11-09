import { Drawer } from 'components/drawer';

export const metadata = {
  title: 'Features - TinkerForm',
  description: 'Explore the features that make TinkerForm unique.',
};

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-5xl mx-auto w-full p-4">
        <h1>Features Page</h1>
      </div>
    </Drawer>
  );
}
