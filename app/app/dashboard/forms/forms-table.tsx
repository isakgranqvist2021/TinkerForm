'use client';

import { EmptyState } from 'components/empty-state';
import Link from 'next/link';
import { type FormDto } from 'services/api/forms';
import { DeleteFormButton, PauseFormButton } from './[id]/actions';
import useSWR from 'swr';
import React from 'react';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { formatDate } from 'utils';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { DeleteFormContextProvider } from 'hooks/use-delete-form';

export function FormsTable() {
  const { isLoading, data } = useForms();

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="skeleton w-16 h-4"></div>
              </th>
              <th>
                <div className="skeleton w-16 h-4"></div>
              </th>
              <th>
                <div className="skeleton w-16 h-4"></div>
              </th>
              <th>
                <div className="skeleton w-16 h-4"></div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <FormSkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
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
    <DeleteFormContextProvider>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Last updated</th>
              <th>Views</th>
              <th>Responses</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{data.map(renderFormTableRow)}</tbody>
        </table>
      </div>
    </DeleteFormContextProvider>
  );
}

function renderFormTableRow(formDto: FormDto) {
  return (
    <tr key={formDto.id}>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={formDto.coverImage} alt="Form cover image" />
            </div>
          </div>
          <div>
            <div className="font-bold max-w-[24ch] whitespace-nowrap overflow-hidden text-ellipsis">
              {formDto.title}
            </div>
            <div className="text-sm opacity-50 max-w-[18ch] whitespace-nowrap overflow-hidden text-ellipsis">
              {formDto.location}
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap">{formatDate(formDto.updatedAt)}</td>
      <td>{formDto.totalResponses ?? 0}</td>
      <td>{formDto.completedResponses ?? 0}</td>
      <th className="text-right whitespace-nowrap">
        <PauseFormButton formId={formDto.id} pausedAt={formDto.pausedAt} />

        <div className="tooltip" data-tip="Edit">
          <Link
            className="btn btn-square btn-ghost"
            href={`/dashboard/forms/${formDto.id}/edit`}
          >
            <PencilSquareIcon className="size-6" />
          </Link>
        </div>

        <DeleteFormButton formId={formDto.id} />

        <Link
          href={`/dashboard/forms/${formDto.id}`}
          className="btn btn-square btn-ghost"
        >
          <ArrowRightCircleIcon className="size-6" />
        </Link>
      </th>
    </tr>
  );
}

function FormSkeletonTableRow() {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="skeleton h-12 w-12 avatar"></div>
          <div>
            <div className="skeleton w-24 h-4"></div>
            <div className="skeleton w-12 h-4 mt-2"></div>
          </div>
        </div>
      </td>
      <td>
        <div className="skeleton w-24 h-4"></div>
      </td>
      <td>
        <div className="skeleton w-24 h-4"></div>
      </td>
      <td>
        <div className="skeleton w-24 h-4"></div>
      </td>
      <th className="text-right whitespace-nowrap">
        <div className="skeleton w-6 h-6 square inline-block"></div>
        <div className="skeleton w-6 h-6 square inline-block ml-2"></div>
        <div className="skeleton w-6 h-6 square inline-block ml-2"></div>
        <div className="skeleton w-6 h-6 square inline-block ml-2"></div>
      </th>
    </tr>
  );
}

export function NewFormButton() {
  const { data } = useForms();

  if (!Boolean(data?.length)) {
    return null;
  }

  return (
    <Link
      href="/dashboard/forms/new"
      className="btn btn-primary btn-sm sm:btn-md"
    >
      New Form
      <PlusCircleIcon className="size-6" />
    </Link>
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
