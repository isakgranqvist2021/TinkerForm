interface EmptyStateProps {
  title: string;
  cta: React.ReactNode;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-base-200 rounded-lg">
      <h2 className="text-lg font-bold mb-2">{props.title}</h2>
      {props.cta}
    </div>
  );
}
