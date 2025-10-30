import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';
import { MainContainer } from 'containers/main-container';
import { listFormsByEmail } from 'db/query';
import { formatDate } from 'utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'My Forms',
};

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const forms = await listFormsByEmail(session.user.email);

  const hasForms = Boolean(forms.length);

  return (
    <MainContainer>
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
            New Form
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

      {hasForms && (
        <ul className="list bg-base-100 rounded-box shadow-md">
          {forms.map(renderFormListItem)}
        </ul>
      )}

      {!hasForms && (
        <div className="bg-base-200 text-center flex flex-col items-center p-6 rounded flex-grow justify-center">
          <p className="mb-4 text-lg font-bold">You have no forms yet.</p>
          <Link href="/forms/new" className="btn btn-primary mb-4">
            New Form
          </Link>
        </div>
      )}
    </MainContainer>
  );
}

function renderFormListItem(
  form: Awaited<ReturnType<typeof listFormsByEmail>>[number],
) {
  return (
    <li key={form.id} className="list-row justify-between flex w-full p-0">
      <Link
        href={`/forms/${form.id}`}
        className="flex-grow p-4 hover:underline"
      >
        <div>
          <div>{form.title}</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            Last updated: {formatDate(form.updated_at)}
          </div>
        </div>
      </Link>

      <div className="flex p-4">
        <div className="tooltip" data-tip="Edit">
          <Link
            className="btn btn-square btn-ghost"
            href={`/forms/${form.id}/edit`}
          >
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
        </div>

        <div className="tooltip" data-tip="Delete">
          <button className="btn btn-square btn-ghost">
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
