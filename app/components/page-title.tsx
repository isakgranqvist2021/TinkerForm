export function PageTitle(props: React.ComponentProps<'h1'>) {
  const { className, ...rest } = props;

  return <h1 className={`text-4xl font-bold ${className || ''}`} {...rest} />;
}
