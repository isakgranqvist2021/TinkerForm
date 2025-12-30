'use client';

import { useTeam } from 'hooks/use-team';
import Link from 'next/link';
import React from 'react';

export function TeamFormsButton() {
  const team = useTeam();

  if (team.isLoading || !team.data) {
    return <p className="link opacity-60">Team Page</p>;
  }

  return (
    <Link href={`/forms/${team.data.id}`} className="link" target="_blank">
      Team Page
    </Link>
  );
}
