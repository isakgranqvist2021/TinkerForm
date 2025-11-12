import React from 'react';
import { getThemeFromCookie } from 'utils/utils.server';

export default async function Pageslayout(props: React.PropsWithChildren) {
  const theme = await getThemeFromCookie();

  return (
    <html data-theme={theme} lang="en">
      <body className="min-h-screen">{props.children}</body>
    </html>
  );
}
