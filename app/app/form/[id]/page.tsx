import { AnswerForm } from 'components/answer-form';
import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { findFormById, insertReponse, listSectionsByFormId } from 'db/query';
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

  const response = await insertReponse(form.id);

  const sections = await listSectionsByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <MainContainer>
      <div>
        <h1 className="m-0 text-lg font-bold">{form.title}</h1>
        <p className="m-0 whitespace-pre-wrap max-w-prose">
          {form.description}
        </p>
      </div>

      <AnswerForm
        responseId={response.id}
        sections={mappedSections}
        formId={params.id}
      />
    </MainContainer>
  );
}
