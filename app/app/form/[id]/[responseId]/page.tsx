import { PageTitle } from 'components/page-title';
import { AnswerForm } from './form';
import { defaultTheme } from 'config/theme';
import { redirect } from 'next/navigation';
import React from 'react';
import { getFormById, getResponseCount } from 'services/api/forms';
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

  const theme = form.theme ?? defaultTheme;

  if (form.availability === 'dates') {
    const now = Date.now();
    const startDate = new Date(form.startDate).getTime();
    const endDate = new Date(form.endDate).getTime();

    if (startDate > now) {
      return (
        <FormContainer data-theme={theme}>
          <PageTitle>This form has not started yet</PageTitle>
          <p>
            The form will be available from{' '}
            {new Date(form.startDate).toLocaleString()}
          </p>
        </FormContainer>
      );
    }

    if (endDate < now) {
      return (
        <FormContainer data-theme={theme}>
          <PageTitle>Form has ended</PageTitle>
          <p>The form ended on {new Date(form.endDate).toLocaleString()}</p>
        </FormContainer>
      );
    }
  }

  if (form.availability === 'responses') {
    const responseCount = await getResponseCount(form.id);

    if (responseCount >= form.maxResponses) {
      return (
        <FormContainer data-theme={theme}>
          <PageTitle>Form has ended</PageTitle>
          <p>The form has reached its maximum number of responses.</p>
        </FormContainer>
      );
    }
  }

  const sections = await getSectionsByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <div data-theme={theme} className="min-h-screen">
      <AnswerForm sections={mappedSections} response={response} form={form} />
    </div>
  );
}

function FormContainer(props: React.ComponentProps<'div'>) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      {...props}
    />
  );
}
