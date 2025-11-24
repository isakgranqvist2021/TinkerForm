'use client';

import { ResponseDto } from 'services/api/response';
import { EmptyState } from 'components/empty-state';
import React from 'react';
import useMutation from 'swr/mutation';
import { ScoreResponse } from 'models/score-response';
import { toast } from 'sonner';
import {
  calculateDuration,
  cn,
  formatDate,
  formatDuration,
  formatScore,
} from 'utils';
import { useRouter } from 'next/navigation';
import { SubscriptionDetails } from 'services/api/subscription';
import { canScoreApplications } from 'config/packages';
import { openResponseModal, ResponseConsumer } from './response-modal';

interface ResponsesTableProps {
  formId: string;
  responses: ResponseDto[];
  subscription: SubscriptionDetails | null;
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

  const counts = props.responses.reduce(
    (acc, curr) => {
      if (curr.completedAt && curr.score === null) {
        acc.withoutScoreCount++;
      }

      return acc;
    },
    {
      withoutScoreCount: 0,
    },
  );

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

        <div
          className="tooltip tooltip-left ml-auto"
          data-tip={
            canScoreApplications(props.subscription?.packageId)
              ? ''
              : 'Please upgrade your package to score applications with AI'
          }
        >
          <button
            className="btn btn-primary btn-sm ml-auto"
            onClick={() => score.trigger()}
            disabled={
              score.isMutating ||
              counts.withoutScoreCount === 0 ||
              !canScoreApplications(props.subscription?.packageId)
            }
          >
            {score.isMutating && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            Score responses with AI ({counts.withoutScoreCount})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('createdAt')}
              >
                Date
              </th>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('completionTime')}
              >
                Completion Time
              </th>
              <th
                className="cursor-pointer hover:text-primary"
                onClick={() => sort('score')}
              >
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

interface ResponseTableRowProps {
  response: ResponseDto;
  index: number;
  score: ScoreResponse | undefined;
}

function ResponseTableRow(props: ResponseTableRowProps) {
  const duration = calculateDuration(
    props.response.createdAt,
    props.response.completedAt,
  );

  return (
    <ResponseConsumer>
      {(ctx) => {
        const handleTableRowClick = () => {
          ctx.setResponse(props.response);
          openResponseModal();
        };

        return (
          <tr
            key={props.response.id}
            className={cn('hover:bg-base-200 cursor-pointer h-[49px]', {
              'bg-base-300': ctx.response?.id === props.response.id,
            })}
            onClick={handleTableRowClick}
          >
            <td>{formatDate(props.response.createdAt)}</td>
            <td>{duration !== null ? formatDuration(duration) : ''}</td>
            <td>
              {props.score ? (
                <div className="flex items-center gap-2">
                  <span>{formatScore(props.score.score)}</span>

                  <div
                    className="tooltip tooltip-left"
                    data-tip={props.score.reasoning}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-base-content/50"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                ''
              )}
            </td>
          </tr>
        );
      }}
    </ResponseConsumer>
  );
}

type SortKey = 'createdAt' | 'completionTime' | 'score';
type SortOrder = 'asc' | 'desc';

function useResponsesTableSorting() {
  const [sortBy, setSortBy] = React.useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  const sort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((sortOrder) => (sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const sorter = (a: ResponseDto, b: ResponseDto) => {
    switch (sortBy) {
      case 'score': {
        const scoreA = a.score ?? -1;
        const scoreB = b.score ?? -1;
        return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }

      case 'createdAt':
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();

        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;

      case 'completionTime':
        const durationA = calculateDuration(a.createdAt, a.completedAt) ?? -1;
        const durationB = calculateDuration(b.createdAt, b.completedAt) ?? -1;

        return sortOrder === 'asc'
          ? durationA - durationB
          : durationB - durationA;
    }
  };

  return { sort, sorter, sortBy, sortOrder };
}
