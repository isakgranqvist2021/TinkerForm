import { Drawer } from 'components/drawer';

export const metadata = {
  title: 'Contact Us - TinkerForm',
  description: 'Get in touch with TinkerForm.',
};

export default function Page() {
  return (
    <Drawer>
      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        <h1>Contact Us</h1>
      </div>
    </Drawer>
  );
}
