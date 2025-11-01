import { AnswerForm } from 'components/answer-form';
import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';
import { PageProps } from 'types/page';

export async function generateMetadata(props: PageProps<{ id: string }>) {
  const params = await props.params;
  const form = await FormTable.findById(params.id);

  return {
    title: form ? form.title : 'Form',
  };
}

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await FormTable.findById(params.id);
  if (!form) {
    return <MainContainer>Form not found</MainContainer>;
  }

  const response = await ResponseTable.insertOne(form.id);

  const sections = await SectionTable.listByFormId(form.id);
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
