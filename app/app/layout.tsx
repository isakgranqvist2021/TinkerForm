import React from 'react';
import 'styles/globals.css';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getThemeFromCookie } from 'utils/utils.server';
import { env } from 'config';

export default async function RootLayout(props: React.PropsWithChildren) {
  const theme = await getThemeFromCookie();

  return (
    <html data-theme={theme} lang="en">
      <body className="min-h-screen">
        {props.children}

        <Toaster richColors />
      </body>

      {env.NODE_ENV === 'production' && <GoogleAnalytics gaId="G-51KMS7QMKY" />}
    </html>
  );
}
