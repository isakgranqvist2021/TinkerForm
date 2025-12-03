'use client';

import React from 'react';
import { StatsDto } from 'services/api/stats';
import useSWR from 'swr';
import { formatMonthlyChange, formatNumber, percentageChange } from 'utils';

export function FormStats() {
  const formStats = useSWR('/api/proxy/stats/forms', async (key) => {
    const res = await fetch(key);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="inline-block h-8 w-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="inline-block h-8 w-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
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
