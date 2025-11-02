import { AnswerForm } from 'components/answer-form';
import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';

export async function generateMetadata(props: PageProps<{ id: string }>) {
  const params = await props.params;
  const form = await FormTable.findById(params.id);

  return {
    title: form ? form.title : 'Form',
    description: form ? form.description : undefined,
  };
}

export default async function Page(
  props: PageProps<{ id: string; responseId: string }>,
) {
  const params = await props.params;

  const form = await FormTable.findById(params.id);
  if (!form) {
    return redirect('/404');
  }

  const response = await ResponseTable.findById(params.responseId);
  if (!response) {
    return redirect(`/form/${form.id}`);
  }

  const sections = await SectionTable.listByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <MainContainer>
      <div className="w-[760px] mx-auto max-w-full gap-8 flex-col flex">
        <div>
          <h1 className="m-0 mb-2 text-lg font-bold">{form.title}</h1>
          <p
            className="m-0 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: form.description }}
          ></p>
        </div>

        <div>
          <AnswerForm
            responseId={response.id}
            sections={mappedSections}
            formId={params.id}
            isCompleted={response.completed_at !== null}
          />
        </div>
      </div>
    </MainContainer>
  );
}
