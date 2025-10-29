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
      {hasForms && (
        <React.Fragment>
          <Link href="/forms/new" className="btn btn-primary mb-4 w-fit">
            Create New Form
          </Link>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td>{form.id}</td>
                    <td>{formatDate(form.created_at)}</td>
                    <td>{formatDate(form.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )}

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
