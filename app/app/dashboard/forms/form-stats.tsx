'use client';

import { CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { StatsDto } from 'services/api/stats';
import useSWR from 'swr';
import { formatMonthlyChange, formatNumber, percentageChange } from 'utils';

export function FormStats() {
  const formStats = useSWR('/api/proxy/stats/forms', async (url) => {
    const res = await fetch(url);

    const data = await res.json();

    return data as StatsDto;
  });

  if (formStats.isLoading) {
    return (
      <div className="stats shadow h-[116px]">
        <div className="stat flex justify-between items-center">
          <div>
            <div className="skeleton h-4 w-20 mb-2"></div>
            <div className="skeleton h-4 w-12 mb-2"></div>
            <div className="skeleton h-4 w-40"></div>
          </div>

          <div className="skeleton h-6 w-6 shrink-0 rounded-full"></div>
        </div>
        <div className="stat flex justify-between items-center">
          <div>
            <div className="skeleton h-4 w-20 mb-2"></div>
            <div className="skeleton h-4 w-12 mb-2"></div>
            <div className="skeleton h-4 w-40"></div>
          </div>

          <div className="skeleton h-6 w-6 shrink-0 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-figure text-primary">
          <EyeIcon className="inline-block h-8 w-8 stroke-current" />
        </div>
        <div className="stat-title">Total Views</div>
        <div className="stat-value text-primary">
          {formatNumber(formStats.data?.currentMonth.totalResponses)}
        </div>
        <div className="stat-desc">
          {formatMonthlyChange(
            percentageChange(
              formStats.data?.currentMonth.totalResponses || 0,
              formStats.data?.previousMonth.totalResponses || 0,
            ),
          )}
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <CheckCircleIcon className="inline-block h-8 w-8 stroke-current" />
        </div>
        <div className="stat-title">Total Responses</div>
        <div className="stat-value text-secondary">
          {formatNumber(formStats.data?.currentMonth.completedResponses)}
        </div>
        <div className="stat-desc">
          {formatMonthlyChange(
            percentageChange(
              formStats.data?.currentMonth.completedResponses || 0,
              formStats.data?.previousMonth.completedResponses || 0,
            ),
          )}
        </div>
      </div>
    </div>
  );
}
