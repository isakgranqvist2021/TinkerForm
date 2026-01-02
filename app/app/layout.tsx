import React from 'react';
import 'styles/globals.css';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getThemeFromCookie } from 'utils/utils.server';
import { env } from 'config';
import { CookieBanner } from 'components/cookie-banner';
import { cookies } from 'next/headers';

export default async function RootLayout(props: React.PropsWithChildren) {
  const theme = await getThemeFromCookie();

  const c = await cookies();
  const hasAcceptedCookies = Boolean(c.get('accept-cookies')?.value);

  return (
    <html data-theme={theme} lang="en">
      <body className="min-h-screen">
        {props.children}

        <CookieBanner isOpen={!hasAcceptedCookies} />
        <Toaster richColors />
      </body>

      {env.NODE_ENV === 'production' && <GoogleAnalytics gaId="G-51KMS7QMKY" />}
    </html>
  );
}
