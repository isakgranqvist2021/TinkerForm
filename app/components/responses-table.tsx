'use client';

import { ResponseDto } from 'services/api/response';
import { EmptyState } from './empty-state';
import { ResponseTableRow } from './response-table-row';
import React from 'react';
import useMutation from 'swr/mutation';
import { ScoreResponse } from 'models/score-response';
import { toast } from 'sonner';
import { calculateDuration } from 'utils';
import { useRouter } from 'next/navigation';

interface ResponsesTableProps {
  formId: string;
  responses: ResponseDto[];
}

export function ResponsesTable(props: ResponsesTableProps) {
  const [onlyShowCompleted, setOnlyShowCompleted] = React.useState(false);

  const { sort, sorter } = useResponsesTableSorting();

  const router = useRouter();

  const score = useMutation(
    `/api/forms/${props.formId}/score`,
    async (url) => {
      try {
        toast.loading(
          'Loading scores, usually takes around 15-30 seconds depending on the number of responses.',
          { id: 'scoring' },
        );

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to score responses');
        }

        const data = await res.json();

        return data.scores as Record<string, ScoreResponse>;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        toast.dismiss('scoring');
        sort('score');

        router.refresh();
      },
      onError: () => {
        toast.error('Failed to score responses. Please try again.', {
          id: 'scoring',
        });
      },
    },
  );

  const isEmpty = Boolean(!props.responses.length);

  if (isEmpty) {
    return (
      <EmptyState
        title="No responses yet"
        subtitle="When someone fills out your form, the responses will be displayed here."
      />
    );
  }

  return (
    <React.Fragment>
      <div className="flex gap-4">
        <label className="label">
          <input
            type="checkbox"
            className="toggle"
            checked={onlyShowCompleted}
            onChange={(e) => setOnlyShowCompleted(e.target.checked)}
          />
          Only show completed
        </label>

        <button
          className="btn btn-primary btn-sm ml-auto"
          onClick={() => score.trigger()}
          disabled={
            score.isMutating ||
            props.responses.filter((response) => response.completedAt !== null)
              .length === 0
          }
        >
          {score.isMutating && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          Score responses with AI
        </button>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => sort('createdAt')}>
                Date
              </th>
              <th
                className="cursor-pointer"
                onClick={() => sort('completionTime')}
              >
                Completion Time
              </th>
              <th className="cursor-pointer" onClick={() => sort('score')}>
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {props.responses
              .filter((response) => {
                if (onlyShowCompleted) {
                  return response.completedAt !== null;
                }

                return true;
              })
              .sort(sorter)
              .map((response, index) => {
                return (
                  <ResponseTableRow
                    key={response.id}
                    response={response}
                    index={index}
                    score={
                      response.score !== null
                        ? {
                            responseId: response.id,
                            score: response.score ?? 0,
                            reasoning: response.reasoning ?? '',
                          }
                        : undefined
                    }
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

type SortKey = 'createdAt' | 'completionTime' | 'score';
type SortOrder = 'asc' | 'desc';

function useResponsesTableSorting() {
  const [sortBy, setSortBy] = React.useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  function sort(key: SortKey) {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  }

  const sorter = (a: ResponseDto, b: ResponseDto) => {
    switch (sortBy) {
      case 'score': {
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;
        return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }

      case 'createdAt':
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case 'completionTime':
        const durationA =
          calculateDuration(a.createdAt, a.completedAt) ?? Infinity;
        const durationB =
          calculateDuration(b.createdAt, b.completedAt) ?? Infinity;

        return sortOrder === 'asc'
          ? durationA - durationB
          : durationB - durationA;
    }
  };

  return { sort, sorter, sortBy, sortOrder };
}
