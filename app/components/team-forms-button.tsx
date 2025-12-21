'use client';

import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { useTeam } from 'hooks/use-team';
import Link from 'next/link';

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
    <Link
      className="btn btn-ghost"
      href={`/forms/${team.data.id}`}
      target="_blank"
    >
      Team forms
      <ArrowRightCircleIcon className="size-6" />
    </Link>
  );
}
