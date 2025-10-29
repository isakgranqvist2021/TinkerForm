import { AddNewForm } from 'components/add-new-form/add-new-form';
import Link from 'next/link';
import React from 'react';
import { PageProps } from 'types/page';
export const metadata = {
  title: 'New Form',
};

export default async function NewForm(props: PageProps<{ id: string }>) {
  const params = await props.params;

  return (
    <section className="container mx-auto px-2 py-8 gap-4 flex flex-col flex-grow">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/forms">Forms</Link>
          </li>
          <li>
            <Link href={`/forms/${params.id}`}>{params.id}</Link>
          </li>
          <li>
            <Link href={`/forms/${params.id}/edit`}>Edit</Link>
          </li>
        </ul>
      </div>

      <AddNewForm defaultValue={[]} />
    </section>
  );
}
