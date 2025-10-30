import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';
import { MainContainer } from 'containers/main-container';
import { listFormsByEmail } from 'db/query';
import { formatDate } from 'utils';
import { redirect } from 'next/navigation';
import { DeleteFormIconButton } from 'components/delete-form-button';

export const metadata = {
  title: 'My Forms',
};

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return redirect('/auth/login');
  }

  const forms = await listFormsByEmail(session.user.email);

  return (
    <MainContainer>
      <div className="flex justify-between">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/dashboard/forms">Forms</Link>
            </li>
          </ul>
        </div>
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">My forms</li>

        {forms.map(renderFormListItem)}

        <AddFormListItem />
      </ul>
    </MainContainer>
  );
}

function AddFormListItem() {
  return (
    <li className="list-row cursor-pointer bg-base-200 rounded-tl-none rounded-tr-none hover:bg-base-300 p-0 flex justify-center items-center">
      <Link
        href="/dashboard/forms/new"
        className="flex gap-2 justify-center items-center p-4 w-full"
      >
        <p className="text-center">Add Form</p>

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
    </li>
  );
}

function renderFormListItem(
  form: Awaited<ReturnType<typeof listFormsByEmail>>[number],
) {
  return (
    <li key={form.id} className="list-row justify-between flex w-full p-0">
      <Link
        href={`/dashboard/forms/${form.id}`}
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
        <div className="tooltip" data-tip="View">
          <Link
            className="btn btn-square btn-ghost"
            href={`/dashboard/forms/${form.id}`}
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
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </Link>
        </div>

        <div className="tooltip" data-tip="Edit">
          <Link
            className="btn btn-square btn-ghost"
            href={`/dashboard/forms/${form.id}/edit`}
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

        <DeleteFormIconButton formId={form.id} />
      </div>
    </li>
  );
}
