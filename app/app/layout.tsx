import React from 'react';
import 'styles/globals.css';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout(props: React.PropsWithChildren) {
  return (
    <React.Fragment>
      {props.children}

      <Toaster richColors />

      <GoogleAnalytics gaId="G-51KMS7QMKY" />
    </React.Fragment>
  );
}
