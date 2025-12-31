'use client';

import {
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PercentBadgeIcon,
} from '@heroicons/react/24/outline';
import { StatsSkeleton, StatsSkeletonItem } from 'components/stats-skeleton';
import { useFormStats } from 'hooks/use-form-stats';
import { useResponses } from 'hooks/use-responses';
import React from 'react';
import {
  calculateAverageCompletionTime,
  formatNumber,
  getCompletionRate,
  getDurations,
} from 'utils';

interface FormStatsProps {
  formId: string;
}

export function FormStats(props: FormStatsProps) {
  const formStats = useFormStats(props.formId);
  const responses = useResponses(props.formId);

  const durations = getDurations(responses.data ?? []);
  const averageCompletionTime = calculateAverageCompletionTime(durations);
  const completionRate = getCompletionRate(
    formStats.data?.completedResponses ?? 0,
    formStats.data?.totalResponses ?? 0,
  );

  if (formStats.isLoading) {
    return (
      <StatsSkeleton className="h-[98px]">
        <StatsSkeletonItem className="w-[277px] h-[98px]" />
        <StatsSkeletonItem className="w-[302px] h-[98px]" />
        <StatsSkeletonItem className="w-[355px] h-[98px]" />
        <StatsSkeletonItem className="w-[313px] h-[98px]" />
      </StatsSkeleton>
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
          {formatNumber(formStats.data?.totalResponses)}
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <CheckCircleIcon className="inline-block h-8 w-8 stroke-current" />
        </div>
        <div className="stat-title">Total Responses</div>
        <div className="stat-value text-secondary">
          {formatNumber(formStats.data?.completedResponses)}
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <ClockIcon className="inline-block h-8 w-8 stroke-current" />
        </div>
        <div className="stat-title">Average Completion Time</div>
        <div className="stat-value text-secondary">
          {averageCompletionTime ?? 'N/A'}
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <PercentBadgeIcon className="inline-block h-8 w-8 stroke-current" />
        </div>
        <div className="stat-title">Completion Rate</div>
        <div className="stat-value">{completionRate}%</div>
      </div>
    </div>
  );
}
