import { AddNewForm } from 'components/add-new-form/add-new-form';
import { MainContainer } from 'containers/main-container';
import { db } from 'db/db';
import { formTable, sectionTable } from 'db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { PageProps } from 'types/page';
export const metadata = {
  title: 'New Form',
};

export default async function NewForm(props: PageProps<{ id: string }>) {
  const params = await props.params;

  const form = await db
    .select()
    .from(formTable)
    .where(eq(formTable.id, params.id));

  const formData = form[0];
  if (!formData) {
    return redirect('/404');
  }

  const sections = await db
    .select()
    .from(sectionTable)
    .where(eq(sectionTable.fk_form_id, formData.id));

  return (
    <MainContainer>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/forms">Forms</Link>
          </li>
          <li>
            <Link href={`/forms/${params.id}`}>{formData.title}</Link>
          </li>
          <li>
            <Link href={`/forms/${params.id}/edit`}>Edit</Link>
          </li>
        </ul>
      </div>

      <AddNewForm
        defaultValues={{
          title: formData.title,
          description: formData.description ?? '',
          sections,
        }}
      />
    </MainContainer>
  );
}
