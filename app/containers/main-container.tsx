export function MainContainer(props: React.PropsWithChildren) {
  return (
    <section className="container mx-auto p-4 gap-4 flex flex-col flex-grow">
      {props.children}
    </section>
  );
}
