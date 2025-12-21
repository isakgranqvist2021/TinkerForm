'use client';

import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useTeam } from 'hooks/use-team';
import Link from 'next/link';

export function TeamFormsButton() {
  const team = useTeam();

  if (team.isLoading || !team.data) {
    return (
      <div className="tooltip" data-tip="View team forms">
        <button className="btn btn-circle btn-ghost" disabled>
          <span className="loading loading-dots loading-sm"></span>
        </button>
      </div>
    );
  }

  return (
    <div className="tooltip" data-tip="View team forms">
      <Link
        className="btn btn-circle btn-ghost"
        href={`/forms/${team.data.id}`}
        target="_blank"
      >
        <BuildingStorefrontIcon className="size-6" />
      </Link>
    </div>
  );
}
