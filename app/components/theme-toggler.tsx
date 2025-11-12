'use client';

import { Theme } from 'config/theme';
import { useChangeTheme } from 'hooks/use-change-theme';
import React from 'react';

export function ThemeToggler() {
  const changeTheme = useChangeTheme();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-circle">
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
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </div>
      <ul
        tabIndex={-1}
        className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl max-h-48 overflow-auto"
      >
        {Object.values(Theme).map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="w-full btn btn-sm btn-block btn-ghost justify-start"
              aria-label={theme}
              value={theme}
              onChange={(e) => changeTheme(e.target.value as Theme)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
