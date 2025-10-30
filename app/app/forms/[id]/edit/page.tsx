import { AddNewForm } from 'components/add-new-form/add-new-form';
import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { findFormById, listSectionsByFormId } from 'db/query';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';
export const metadata = {
  title: 'New Form',
};

export default async function Page(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await findFormById(params.id);

  if (!form) {
    return redirect('/404');
  }

  const sections = await listSectionsByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <MainContainer>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/forms">Forms</Link>
          </li>
          <li>
            <Link href={`/forms/${params.id}`}>{form.title}</Link>
          </li>
          <li>
            <Link href={`/forms/${params.id}/edit`}>Edit</Link>
          </li>
        </ul>
      </div>

      <AddNewForm
        defaultValues={{
          title: form.title,
          description: form.description ?? '',
          sections: mappedSections,
        }}
      />
    </MainContainer>
  );
}
