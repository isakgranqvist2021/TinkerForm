import Link from 'next/link';
import React from 'react';
import { auth0 } from 'lib/auth0';
import { Footer } from './footer';
import { PickThemeMenu } from './pick-theme-menu-item';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

const id = 'main-drawer';

export async function Drawer(props: React.PropsWithChildren) {
  const session = await auth0.getSession();

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
      <input id={id} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content min-h-screen flex flex-col">
        <div className="navbar bg-base-100 shadow-sm lg:h-[72px]">
          <div className="max-w-7xl mx-auto flex justify-between w-full">
            <div className="navbar-start flex-row-reverse justify-between lg:flex-row grow">
              <label
                htmlFor={id}
                className="btn btn-circle drawer-button mr-2 lg:hidden"
                role="button"
                aria-label="Open drawer"
              >
                <Bars3Icon className="size-6" />
              </label>

              <Link className="btn btn-ghost text-xl" href="/">
                TinkerForm
              </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">{links}</ul>
            </div>

            <div className="navbar-end gap-4 hidden lg:flex">
              {session ? (
                <Link href="/dashboard/forms" className="btn btn-primary mr-4">
                  Dashboard
                </Link>
              ) : (
                <a href="/auth/login" className="btn btn-primary mr-4">
                  Login
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
          htmlFor={id}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {session ? (
            <li>
              <Link href="/dashboard/forms">Dashboard</Link>
            </li>
          ) : (
            <li>
              <a className="btn btn-primary mb-4" href="/auth/login">
                Login
              </a>
            </li>
          )}

          {links}

          <PickThemeMenu />

          <label
            role="button"
            htmlFor={id}
            className="btn btn-circle absolute bottom-4 right-4"
            aria-label="Close drawer"
          >
            <XCircleIcon className="size-6" />
          </label>
        </ul>
      </div>
    </div>
  );
}
