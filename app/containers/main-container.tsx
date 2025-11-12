export function MainContainer(props: React.PropsWithChildren) {
  return (
    <section
      className="container mx-auto p-4 gap-4 flex flex-col flex-grow"
      {...props}
    />
  );
}

export function Container(props: React.PropsWithChildren) {
  return (
    <section className="max-w-7xl mx-auto w-full p-4 flex-grow" {...props} />
  );
}
