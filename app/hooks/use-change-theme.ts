import { Theme } from 'config/theme';

export function useChangeTheme() {
  const changeTheme = async (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);

    await fetch('/api/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });
  };

  return changeTheme;
}
