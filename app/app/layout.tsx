import { Drawer } from 'components/drawer';
import React from 'react';
import 'styles/globals.css';
import { Toaster } from 'sonner';

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html data-theme="emerald" lang="en">
      <body className="min-h-screen">
        <Drawer>{props.children}</Drawer>
        <Toaster richColors />
      </body>
    </html>
  );
}
