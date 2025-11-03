import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Home',
};

export default async function Page() {
  const session = await auth0.getSession();

  return (
    <React.Fragment>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between w-full">
          <div className="navbar-start">
            <a className="btn btn-ghost text-xl">TinkerForm</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a>Product</a>
              </li>
              <li>
                <a>Pricing</a>
              </li>
              <li>
                <a>Features</a>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <a href="/dashboard/forms" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <div className="hero bg-base-200 min-h-screen p-4">
        <div className="hero-content flex-col lg:flex-row max-w-5xl gap-12">
          <div>
            <h1 className="text-5xl font-bold max-w-prose">
              Build beautiful forms, fast and easyly.
            </h1>
            <p className="py-6 max-w-prose">
              TinkerForm is the easiest way to create and manage forms for your
              website or application. Get started in minutes with our intuitive
              drag-and-drop builder.
            </p>
            <a href="/dashboard/forms" className="btn btn-primary">
              Get Started
            </a>
          </div>

          <img src="/art.svg" className="max-w-sm" />
        </div>
      </div>
    </React.Fragment>
  );
}
