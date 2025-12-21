'use client';

import { EmptyState } from 'components/empty-state';
import Link from 'next/link';
import { type FormDto } from 'services/api/forms';
import { DeleteFormButton, PauseFormButton } from './[id]/actions';
import useSWR from 'swr';
import React from 'react';
import { DeleteFormModal } from 'hooks/use-delete-form';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

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
            <PlusCircleIcon className="size-6" />
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
    <React.Fragment>
      <Link
        href="/dashboard/forms/new"
        className="btn btn-primary hidden sm:flex"
      >
        New Form
        <PlusCircleIcon className="size-6" />
      </Link>

      <Link
        href="/dashboard/forms/new"
        className="btn btn-primary btn-circle sm:hidden"
      >
        <PlusCircleIcon className="size-6" />
      </Link>
    </React.Fragment>
  );
}

function renderFormListItem(form: FormDto) {
  const responseCount = Number(form.responseCount ?? 0);

  return (
    <li key={form.id} className="list-row">
      <div>
        <img className="size-10 rounded-box" src={form.coverImage} />
      </div>

      <Link href={`/dashboard/forms/${form.id}`} className="hover:underline">
        <div>{form.title}</div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {responseCount === 0
            ? 'No responses'
            : responseCount === 1
              ? '1 response'
              : `${responseCount} responses`}
        </div>
      </Link>

      <div className="flex">
        <PauseFormButton formId={form.id} pausedAt={form.pausedAt} />

        <div className="tooltip" data-tip="Edit">
          <Link
            className="btn btn-square btn-ghost"
            href={`/dashboard/forms/${form.id}/edit`}
          >
            <PencilSquareIcon className="size-6" />
          </Link>
        </div>

        <DeleteFormButton formId={form.id} />
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
