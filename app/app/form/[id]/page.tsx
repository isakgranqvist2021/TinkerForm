import { MainContainer } from 'containers/main-container';
import { redirect } from 'next/navigation';
import { getFormById } from 'services/api/forms';
import { createResponse } from 'services/api/response';
import { PageProps } from 'types/page';

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await getFormById(params.id);
  if (!form) {
    return <MainContainer>Form not found</MainContainer>;
  }

  const response = await createResponse(form.id);
  if (!response) {
    return <MainContainer>Failed to create response</MainContainer>;
  }

  return redirect(`/form/${form.id}/${response.id}`);
}
