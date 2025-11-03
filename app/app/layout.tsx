import React from 'react';
import 'styles/globals.css';
import { Toaster } from 'sonner';

export default async function RootLayout(props: React.PropsWithChildren) {
  return (
    <html data-theme="corporate" lang="en">
      <body className="min-h-screen">
        {props.children}

        <Toaster richColors />
      </body>
    </html>
  );
}
