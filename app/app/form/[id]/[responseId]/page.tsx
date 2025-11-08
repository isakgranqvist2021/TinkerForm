import { AnswerForm } from 'components/answer-form';
import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { SectionTable } from 'db/query/section';
import { redirect } from 'next/navigation';
import React from 'react';
import { getFormById } from 'services/api/forms';
import { getResponseById } from 'services/api/response';
import { getSectionsByFormId } from 'services/api/section';
import { PageProps } from 'types/page';

export async function generateMetadata(props: PageProps<{ id: string }>) {
  const params = await props.params;
  const form = await getFormById(params.id);

  return {
    title: form ? form.title : 'Form',
    description: form ? form.description : undefined,
  };
}

export default async function Page(
  props: PageProps<{ id: string; responseId: string }>,
) {
  const params = await props.params;

  const form = await getFormById(params.id);
  const response = await getResponseById(params.responseId);

  if (!form || !response) {
    return redirect('/404');
  }

  const sections = await getSectionsByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <MainContainer>
      <AnswerForm sections={mappedSections} response={response} form={form} />
    </MainContainer>
  );
}
