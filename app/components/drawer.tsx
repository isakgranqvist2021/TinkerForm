import Link from 'next/link';
import React from 'react';
import { ThemeToggler } from './theme-toggler';
import { getThemeFromCookie } from 'utils/utils.server';
import { auth0 } from 'lib/auth0';
import { Footer } from './footer';

export async function Drawer(props: React.PropsWithChildren) {
  const session = await auth0.getSession();
  const theme = await getThemeFromCookie();

  const links = (
    <React.Fragment>
      <li>
        <Link href="/product">Product</Link>
      </li>
      <li>
        <Link href="/pricing">Pricing</Link>
      </li>
      <li>
        <Link href="/features">Features</Link>
      </li>
    </React.Fragment>
  );

  return (
    <div className="drawer">
      <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content min-h-screen flex flex-col">
        <div className="navbar bg-base-100 shadow-sm lg:h-[72px]">
          <div className="max-w-6xl mx-auto flex justify-between w-full">
            <div className="navbar-start">
              <label
                htmlFor="my-drawer-1"
                className="btn btn-circle drawer-button mr-2 lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </label>

              <Link className="btn btn-ghost text-xl" href="/">
                TinkerForm
              </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">{links}</ul>
            </div>
            <div className="navbar-end gap-4 hidden lg:flex">
              <ThemeToggler initialState={theme} />

              {session ? (
                <Link href="/dashboard/forms" className="btn btn-primary">
                  Dashboard
                </Link>
              ) : (
                <a href="/auth/login" className="btn btn-primary">
                  Get Started
                </a>
              )}
            </div>
          </div>
        </div>

        {props.children}

        <Footer />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-1"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {session ? (
            <li>
              <Link href="/dashboard/forms">Dashboard</Link>
            </li>
          ) : (
            <li>Get Started</li>
          )}
          {links}
        </ul>
      </div>
    </div>
  );
}
