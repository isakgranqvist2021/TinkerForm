'use client';

import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { useTeam } from 'hooks/use-team';
import Link from 'next/link';
import React from 'react';

export function TeamFormsButton() {
  const team = useTeam();

  if (team.isLoading || !team.data) {
    return (
      <button className="btn btn-neutral" disabled>
        <span className="loading loading-dots loading-sm absolute"></span>
        <span className="opacity-0">Team Page</span>
        <ArrowRightCircleIcon className="size-6 opacity-0" />
      </button>
    );
  }

  return (
    <Link
      href={`/forms/${team.data.id}`}
      className="btn btn-neutral btn-sm sm:btn-md"
      target="_blank"
    >
      Team Page
      <ArrowRightCircleIcon className="size-6" />
    </Link>
  );
}
