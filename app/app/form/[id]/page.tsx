import { MainContainer } from 'containers/main-container';
import { findFormById, listSectionsByFormId } from 'db/query';
import { PageProps } from 'types/page';

export async function generateMetadata(props: PageProps<{ id: string }>) {
  const params = await props.params;
  const form = await findFormById(params.id);

  return {
    title: form ? form.title : 'Form',
  };
}

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await findFormById(params.id);
  if (!form) {
    return <MainContainer>Form not found</MainContainer>;
  }

  const sections = await listSectionsByFormId(form.id);

  return (
    <MainContainer>
      <h1>{form.title}</h1>
      <p className="whitespace-pre-wrap">{form.description}</p>

      {sections.map((section) => (
        <p key={section.id}>{section.title}</p>
      ))}
    </MainContainer>
  );
}
