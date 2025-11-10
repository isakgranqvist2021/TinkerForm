import { Footer } from 'components/footer';
import { Nav } from 'components/nav';
import { auth0 } from 'lib/auth0';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout(props: React.PropsWithChildren) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="max-w-6xl mx-auto w-full p-4 flex-grow">
        {props.children}
      </div>

      <Footer />
    </div>
  );
}
