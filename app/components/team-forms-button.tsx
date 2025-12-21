'use client';

import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { useTeam } from 'hooks/use-team';
import Link from 'next/link';
import React from 'react';

export function TeamFormsButton() {
  const team = useTeam();

  if (team.isLoading || !team.data) {
    return (
      <button className="btn btn-ghost" disabled>
        <span className="loading loading-dots loading-sm absolute"></span>
        Team forms
      </button>
    );
  }

  return (
    <React.Fragment>
      <Link
        href={`/forms/${team.data.id}`}
        className="btn btn-neutral hidden sm:flex"
        target="_blank"
      >
        Team forms
        <ArrowRightCircleIcon className="size-6" />
      </Link>

      <Link
        href={`/forms/${team.data.id}`}
        className="btn btn-neutral btn-circle sm:hidden"
        target="_blank"
      >
        <ArrowRightCircleIcon className="size-6" />
      </Link>
    </React.Fragment>
  );
}
