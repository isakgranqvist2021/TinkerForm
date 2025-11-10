import { Drawer } from 'components/drawer';

export const metadata = {
  title: 'Company - TinkerForm',
  description: 'Learn more about our company and team.',
};

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        <h1>Company Page</h1>
      </div>
    </Drawer>
  );
}
