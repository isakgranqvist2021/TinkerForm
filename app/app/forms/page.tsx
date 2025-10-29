import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import { db } from 'db/db';
import { formTable } from 'db/schema';
import { eq } from 'drizzle-orm';
import React from 'react';
import { formatDate } from 'utils';

export default async function FormsPage() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return <p>Please log in to view your forms.</p>;
  }

  const forms = await db
    .select()
    .from(formTable)
    .where(eq(formTable.email, session.user.email));

  const hasForms = Boolean(forms.length);
  return (
    <section className="container mx-auto px-2 py-8 gap-4 flex flex-col flex-grow">
      <div className="flex justify-between">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/forms">Forms</Link>
            </li>
          </ul>
        </div>

        {hasForms && (
          <Link href="/forms/new" className="btn btn-primary mb-4 w-fit">
            Create New Form
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Link>
        )}
      </div>

      {hasForms &&
        forms.map((form) => (
          <Link key={form.id} href={`/forms/${form.id}`}>
            {form.id}
          </Link>
        ))}

      {!hasForms && (
        <div className="bg-base-200 text-center flex flex-col items-center p-6 rounded flex-grow justify-center">
          <p className="mb-4 text-lg font-bold">You have no forms yet.</p>
          <Link href="/forms/new" className="btn btn-primary mb-4">
            Create New Form
          </Link>
        </div>
      )}
    </section>
  );
}
