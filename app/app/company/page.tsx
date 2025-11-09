import { Drawer } from 'components/drawer';

export const metadata = {
  title: 'Company - TinkerForm',
  description: 'Learn more about our company and team.',
};

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-5xl mx-auto w-full p-4">
        <h1>Company Page</h1>
      </div>
    </Drawer>
  );
}
