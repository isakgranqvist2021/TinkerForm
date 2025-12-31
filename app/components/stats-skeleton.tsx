import React from 'react';
import { cn } from 'utils';

export function StatsSkeleton(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props;

  return <div className={cn('stats shadow h-[116px]', className)} {...rest} />;
}

export function StatsSkeletonItem(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props;

  return (
    <div
      className={cn('stat flex justify-between items-center', className)}
      {...rest}
    >
      <div>
        <div className="skeleton h-4 w-20 mb-2"></div>
        <div className="skeleton h-4 w-12 mb-2"></div>
        <div className="skeleton h-4 w-40"></div>
      </div>

      <div className="skeleton h-6 w-6 shrink-0 rounded-full"></div>
    </div>
  );
}
