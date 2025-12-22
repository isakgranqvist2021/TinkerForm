import { EmptyState } from 'components/empty-state';
import { ContentContainer, MainContainer } from 'containers/containers';
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
    return (
      <MainContainer>
        <ContentContainer>
          <EmptyState
            title="Form not found"
            subtitle="Make sure you have entered the URL exactly as you received it."
          />
        </ContentContainer>
      </MainContainer>
    );
  }

  const response = await createResponse(form.id);
  if (!response) {
    return (
      <MainContainer>
        <ContentContainer>
          <EmptyState
            title="Could not load form"
            subtitle="Make sure you have entered the URL exactly as you received it."
          />
        </ContentContainer>
      </MainContainer>
    );
  }

  return redirect(`/forms/${params.teamId}/${form.id}/${response.id}`);
}
