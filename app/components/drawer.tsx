import React from 'react';
import { Nav } from './nav';
import Link from 'next/link';

export function Drawer(props: React.PropsWithChildren) {
  return (
    <div className="drawer min-h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">
        <Nav />

        {props.children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li>
            <Link href="/">Link 1</Link>
          </li>
          <li>
            <Link href="/">Link 2</Link>
          </li>
          <li>
            <Link href="/">Link 1</Link>
          </li>
          <li>
            <Link href="/">Link 2</Link>
          </li>
          <li>
            <Link href="/">Link 1</Link>
          </li>
          <li>
            <Link href="/">Link 2</Link>
          </li>
          <li>
            <Link href="/">Link 1</Link>
          </li>
          <li>
            <Link href="/">Link 2</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
