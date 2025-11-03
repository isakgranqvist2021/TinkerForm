import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Home',
};

export default async function Page() {
  const session = await auth0.getSession();

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-neutral text-center">
        <div className="max-w-md">
          <img src="/art.svg" alt="" className="mb-10" />

          <h1 className="mb-5 text-5xl font-bold">TinkerForm</h1>

          <p className="mb-5">
            Create and manage forms with ease. Sign up or log in to get started!
          </p>

          {session ? (
            <Link href="/dashboard/forms" className="btn btn-primary">
              My Forms
            </Link>
          ) : (
            <a href="/auth/login" className="btn btn-primary">
              Get Started
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
