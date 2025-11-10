import { AnswerForm } from 'components/answer-form';
import { MainContainer } from 'containers/main-container';
import { redirect } from 'next/navigation';
import React from 'react';
import { getFormById } from 'services/api/forms';
import { getResponseById } from 'services/api/response';
import { getSectionsByFormId, sectionMapper } from 'services/api/section';
import { PageProps } from 'types/page';
import { getMetadata } from 'utils';

export async function generateMetadata(props: PageProps<{ id: string }>) {
  const params = await props.params;
  const form = await getFormById(params.id);

  return getMetadata({
    title: form ? form.title : 'Response Not Found',
    description: form
      ? `View the response for the form "${form.title}".`
      : 'The requested response was not found.',
  });
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
