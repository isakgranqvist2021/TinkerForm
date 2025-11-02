interface EmptyStateProps {
  title: string;
  subtitle: string;
  cta?: React.ReactNode;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-base-200 rounded-lg">
      <h1 className="text-3xl font-bold">{props.title}</h1>
      <p className="py-4">{props.subtitle}</p>

      {props.cta}
    </div>
  );
}
