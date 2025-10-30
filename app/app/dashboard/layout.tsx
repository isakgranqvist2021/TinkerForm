import { Nav } from 'components/nav';
import React from 'react';

export default function AdminLayout(props: React.PropsWithChildren) {
  return (
    <React.Fragment>
      <Nav />

      {props.children}
    </React.Fragment>
  );
}
