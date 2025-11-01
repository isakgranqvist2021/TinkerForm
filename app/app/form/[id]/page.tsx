import { MainContainer } from 'containers/main-container';
import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { redirect } from 'next/navigation';
import { PageProps } from 'types/page';

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await FormTable.findById(params.id);
  if (!form) {
    return <MainContainer>Form not found</MainContainer>;
  }

  const response = await ResponseTable.insertOne(form.id);

  return redirect(`/form/${form.id}/${response.id}`);
}
