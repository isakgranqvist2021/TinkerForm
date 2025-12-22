import React from 'react';
import { cn } from 'utils';

export function ContentContainer(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props;

  return (
    <section
      className={cn(
        'container mx-auto p-4 gap-4 flex flex-col flex-grow',
        className,
      )}
      {...rest}
    />
  );
}

export function MainContainer(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props;

  return (
    <section
      className={cn('max-w-7xl mx-auto w-full flex-grow', className)}
      {...rest}
    />
  );
}

export function Container(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props;

  return (
    <section
      className={cn('max-w-7xl mx-auto w-full p-4 flex-grow', className)}
      {...rest}
    />
  );
}
