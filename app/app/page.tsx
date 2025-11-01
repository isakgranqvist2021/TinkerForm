import { MainContainer } from 'containers/main-container';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Home',
};

export default function Page() {
  return (
    <MainContainer>
      <Link href="/dashboard">Go to Dashboard</Link>
    </MainContainer>
  );
}
