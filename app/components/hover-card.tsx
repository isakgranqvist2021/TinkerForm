import { cn } from 'utils';

export function HoverCard(props: React.ComponentProps<'div'>) {
  const { children, className, ...rest } = props;

  return (
    <div className={cn('hover-3d', className)} {...rest}>
      {/* content */}
      {children}

      {/* 8 empty divs needed for the 3D effect */}
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
