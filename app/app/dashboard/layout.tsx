import { User } from '@auth0/nextjs-auth0/types';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Footer } from 'components/footer';
import { PickThemeMenu } from 'components/pick-theme-menu-item';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout(props: React.PropsWithChildren) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="max-w-7xl mx-auto w-full flex-grow">{props.children}</div>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex justify-between items-center mx-auto max-w-7xl mx-auto flex justify-between w-full">
        <div className="flex-1 gap-2 flex">
          <Link href="/" className="btn btn-ghost text-xl">
            TinkerForm
          </Link>
        </div>
        <ul className="menu menu-horizontal px-1 flex items-center gap-2">
          <li>
            <Link href="/dashboard/forms">My Forms</Link>
          </li>

          <NavDropdown />
        </ul>
      </div>
    </div>
  );
}

function NavDropdown() {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <UserCircleIcon className="size-6" />
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link href="/dashboard/account/settings">Settings</Link>
        </li>
        <li>
          <Link href="/dashboard/account/billing">Billing</Link>
        </li>

        <PickThemeMenu />

        <li>
          <Link href="/auth/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}
