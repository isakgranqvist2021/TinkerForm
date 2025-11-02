import { EditForm } from 'components/edit-form';
import { MainContainer } from 'containers/main-container';
import { sectionMapper } from 'db/mapper';
import { FormTable } from 'db/query/form';
import { SectionTable } from 'db/query/section';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';

export const metadata = {
  title: 'Edit Form',
};

export default async function Page(props: PageProps<{ id: string }>) {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const params = await props.params;

  const form = await FormTable.findById(params.id);

  if (!form || form.email !== session.user.email) {
    return redirect('/404');
  }

  const sections = await SectionTable.listByFormId(form.id);
  const mappedSections = sections.map(sectionMapper);

  return (
    <MainContainer>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard/forms">Forms</Link>
          </li>
          <li>
            <Link href={`/dashboard/forms/${params.id}`}>{form.title}</Link>
          </li>
          <li>
            <Link href={`/dashboard/forms/${params.id}/edit`}>Edit</Link>
          </li>
        </ul>
      </div>

      <EditForm
        formId={params.id}
        defaultValues={{
          title: form.title,
          description: form.description,
          location: form.location,
          sections: mappedSections.sort((a, b) => a.index - b.index),
        }}
      />
    </MainContainer>
  );
}
