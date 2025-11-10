import { EditForm } from 'components/edit-form';
import { MainContainer } from 'containers/main-container';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { getFormById } from 'services/api/forms';
import { getSectionsByFormId, sectionMapper } from 'services/api/section';
import { PageProps } from 'types/page';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Edit Form',
  description: 'Edit your form and its sections.',
});

export default async function Page(props: PageProps<{ id: string }>) {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const params = await props.params;

  const form = await getFormById(params.id);

  if (!form || form.email !== session.user.email) {
    return redirect('/404');
  }

  const sections = await getSectionsByFormId(form.id);

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
          sections: mappedSections
            .map((section) => {
              if (section.type === 'multiple-choice') {
                return {
                  ...section,
                  options: section.options.map((option) => ({
                    text: option.text,
                  })),
                };
              }

              return section;
            })
            .sort((a, b) => a.index - b.index),
        }}
      />
    </MainContainer>
  );
}
