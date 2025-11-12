import React from 'react';
import 'styles/globals.css';
import { Toaster } from 'sonner';
import { getThemeFromCookie } from 'utils/utils.server';
import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout(props: React.PropsWithChildren) {
  const theme = await getThemeFromCookie();

  return (
    <html data-theme={theme} lang="en">
      <body className="min-h-screen">
        {props.children}

        <Toaster richColors />
      </body>

      <GoogleAnalytics gaId="G-51KMS7QMKY" />
    </html>
  );
}
