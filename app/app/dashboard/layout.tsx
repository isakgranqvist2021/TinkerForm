import { User } from '@auth0/nextjs-auth0/types';
import { Footer } from 'components/footer';
import { PickThemeMenu } from 'components/pick-theme-menu-item';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

interface UserProps {
  user: User;
}

export default async function DashboardLayout(props: React.PropsWithChildren) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav user={session.user} />

      <div className="max-w-7xl mx-auto w-full flex-grow">{props.children}</div>

      <Footer />
    </div>
  );
}

function Nav(props: UserProps) {
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

          <NavDropdown user={props.user} />
        </ul>
      </div>
    </div>
  );
}

function NavDropdown(props: UserProps) {
  const { user } = props;

  return (
    <div className="dropdown dropdown-end">
      <ProfileMenuAvatar user={user} />

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

function ProfileMenuAvatar(props: UserProps) {
  const { user } = props;

  const placeholderName = `${user.given_name?.charAt(0)}${user.family_name?.charAt(0)}`;

  return (
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      {user.picture ? (
        <div className="w-8 rounded-full">
          <img alt={placeholderName} src={user.picture} />
        </div>
      ) : (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-8 rounded-full">
            <span className="text-xs">{placeholderName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
