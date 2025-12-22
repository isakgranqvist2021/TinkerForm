import { ContentContainer } from 'containers/containers';
import { redirect } from 'next/navigation';
import { getFormById } from 'services/api/forms';
import { createResponse } from 'services/api/response';
import { PageProps } from 'types/page';

export default async function Page(
  props: PageProps<{ id: string; teamId: string }>,
) {
  const params = await props.params;

  const form = await getFormById(params.id);
  if (!form) {
    return <ContentContainer>Form not found</ContentContainer>;
  }

  const response = await createResponse(form.id);
  if (!response) {
    return <ContentContainer>Failed to create response</ContentContainer>;
  }

  return redirect(`/forms/${params.teamId}/${form.id}/${response.id}`);
}
