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

  return <FormsTableContent data={data} />;
}

interface FormsTableContentProps {
  data: FormDto[];
}
function FormsTableContent(props: FormsTableContentProps) {
  const { sorter, sort } = useFormsTableSorting();

  return (
    <DeleteFormContextProvider>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('title')}
              >
                Title
              </th>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('updatedAt')}
              >
                Last updated
              </th>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('totalResponses')}
              >
                Views
              </th>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('completedResponses')}
              >
                Responses
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>{props.data.sort(sorter).map(renderFormTableRow)}</tbody>
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

        <div className="tooltip tooltip-left" data-tip="Form Details">
          <Link
            href={`/dashboard/forms/${formDto.id}`}
            className="btn btn-square btn-ghost"
          >
            <ArrowRightCircleIcon className="size-6" />
          </Link>
        </div>
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

type SortKey = 'title' | 'updatedAt' | 'totalResponses' | 'completedResponses';
type SortOrder = 'asc' | 'desc';

function useFormsTableSorting() {
  const [sortBy, setSortBy] = React.useState<SortKey>('title');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  const sort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((sortOrder) => (sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const sorter = (a: FormDto, b: FormDto) => {
    const modifier = sortOrder === 'asc' ? 1 : -1; // Apply the order here!

    let result = 0;
    switch (sortBy) {
      case 'title':
        result = a.title.localeCompare(b.title);
        break;
      case 'updatedAt':
        result =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'totalResponses':
        result = (a.totalResponses ?? 0) - (b.totalResponses ?? 0);
        break;
      case 'completedResponses':
        result = (a.completedResponses ?? 0) - (b.completedResponses ?? 0);
        break;
    }

    return result * modifier;
  };

  return { sort, sorter, sortBy, sortOrder };
}
