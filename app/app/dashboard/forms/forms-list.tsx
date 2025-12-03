'use client';

import { EmptyState } from 'components/empty-state';
import Link from 'next/link';
import { type FormDto } from 'services/api/forms';
import { DeleteFormIconButton, DeleteFormModal } from './[id]/actions';
import useSWR from 'swr';
import React from 'react';

export function FormsList() {
  const { isLoading, data } = useForms();

  if (isLoading) {
    return (
      <ul className="list bg-base-100 rounded-box shadow-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <FormListSkeletonItem key={i} />
        ))}
      </ul>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="You have no forms yet."
        subtitle="Create your first form to start collecting responses."
        cta={
          <Link href="/dashboard/forms/new" className="btn btn-outline mb-4">
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
        }
      />
    );
  }

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">My forms</li>

      {data.map(renderFormListItem)}
    </ul>
  );
}

function FormListSkeletonItem() {
  return (
    <li className="flex justify-between items-center list-row">
      <div className="flex gap-2 flex-col">
        <div className="skeleton h-4 w-72"></div>
        <div className="skeleton h-4 w-28"></div>
      </div>

      <div className="flex gap-2">
        <div className="skeleton h-8 w-8"></div>
        <div className="skeleton h-8 w-8"></div>
      </div>
    </li>
  );
}

export function NewFormButton() {
  const { data } = useForms();

  if (!Boolean(data?.length)) {
    return null;
  }

  return (
    <div className="tooltip" data-tip="New Form">
      <Link href="/dashboard/forms/new" className="btn btn-circle">
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
    </div>
  );
}

function renderFormListItem(form: FormDto) {
  const responseCount = Number(form.responseCount ?? 0);

  return (
    <li key={form.id} className="list-row justify-between flex w-full p-0">
      <Link
        href={`/dashboard/forms/${form.id}`}
        className="flex-grow p-4 hover:underline"
      >
        <div>
          <div>{form.title}</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            {responseCount === 0
              ? 'No responses'
              : responseCount === 1
                ? '1 response'
                : `${responseCount} responses`}
          </div>
        </div>
      </Link>

      <div className="flex p-4">
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
        <DeleteFormModal formId={form.id} />
      </div>
    </li>
  );
}

function useForms() {
  return useSWR('/api/proxy/form', async (url): Promise<FormDto[]> => {
    try {
      const res = await fetch(url);

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  });
}
