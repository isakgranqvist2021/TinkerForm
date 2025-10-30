import Link from 'next/link';
import React from 'react';
import { auth0 } from 'lib/auth0';

export function Nav() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="container flex justify-between items-center mx-auto">
        <div className="flex-1 gap-2 flex">
          <label htmlFor="my-drawer" className="btn btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
              />
            </svg>
          </label>

          <Link href="/" className="btn btn-ghost text-xl">
            Template
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

async function NavDropdown() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <li>
        <Link href="/auth/login">Log In</Link>
      </li>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        {user.picture ? (
          <div className="w-8 rounded-full">
            <img alt="User avatar" src={user.picture} />
          </div>
        ) : (
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
              <span className="text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        )}
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link href="/dashboard/account">My Account</Link>
        </li>
        <li>
          <Link href="/auth/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}
