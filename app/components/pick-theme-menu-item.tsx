'use client';

import { Theme } from 'config/theme';
import { useChangeTheme } from 'hooks/use-change-theme';

export function PickThemeMenu() {
  const changeTheme = useChangeTheme();

  return (
    <li>
      <details>
        <summary>Theme</summary>
        <ul>
          {Object.values(Theme).map((theme) => (
            <li key={theme} onClick={() => changeTheme(theme)}>
              <a className="capitalize">{theme}</a>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}
