import { Drawer } from 'components/drawer';
import React from 'react';

export default function AdminLayout(props: React.PropsWithChildren) {
  return <Drawer>{props.children}</Drawer>;
}
