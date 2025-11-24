'use client';

import React from 'react';
import {
  calculateDuration,
  formatDate,
  formatDuration,
  formatScore,
} from 'utils';
import useSWR from 'swr';
import { SectionType } from 'models/form';
import Link from 'next/link';
import { AnswersByResponseIdDto, ResponseDto } from 'services/api/response';

function ResponseModal() {
  const responseContext = useResponseContext();

  return (
    <dialog id={modalName} className="modal">
      {responseContext.response && (
        <ResponseModalContent
          response={responseContext.response}
          onClose={() => {
            closeResponseModal();
            responseContext.setResponse(null);
          }}
        />
      )}
    </dialog>
  );
}

interface ResponseModalContentProps {
  response: ResponseDto;
  onClose: () => void;
}

function ResponseModalContent(props: ResponseModalContentProps) {
  const { data, error, isLoading } = useSWR(
    `/api/response/${props.response.id}`,
    async () => {
      const res = await fetch(`/api/response/${props.response.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch response details');
      }

      return (await res.json()) as {
        answers: AnswersByResponseIdDto[];
        response: ResponseDto;
      };
    },
  );

  const duration = calculateDuration(
    props.response.createdAt,
    props.response.completedAt,
  );

  const hasAnswers = Boolean(data?.answers.length);

  return (
    <React.Fragment>
      <div className="modal-box">
        <div className="flex flex-col gap-2">
          {!hasAnswers && !isLoading && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>No answers available.</span>
            </div>
          )}

          {error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Failed to load answers.</span>
            </div>
          )}

          <ul className="list bg-base-100 rounded-box shadow-md">
            <AnswerListItem
              question="Date"
              answer={formatDate(props.response.createdAt)}
              type="text"
            />

            <AnswerListItem
              question="Completion time"
              answer={duration ? formatDuration(duration) : 'N/A'}
              type="text"
            />

            {props.response.score !== null && (
              <AnswerListItem
                question="Score"
                answer={formatScore(props.response.score)}
                type="text"
              />
            )}

            {props.response.reasoning !== null && (
              <AnswerListItem
                question="Score Reasoning"
                answer={props.response.reasoning
                  .split(';')
                  .map((value) => value.trim())
                  .join('.\n')}
                type="text"
              />
            )}

            {hasAnswers &&
              !isLoading &&
              data?.answers.map((item, index: number) => (
                <AnswerListItem
                  key={index}
                  question={item.section.title}
                  answer={
                    item.answer.answerText ??
                    item.answer.answerNumber?.toString() ??
                    item.answer.answerBoolean?.toString() ??
                    item.answer.answerFile ??
                    ''
                  }
                  type={item.section.type}
                />
              ))}
          </ul>

          {isLoading && (
            <span className="loading loading-dots loading-md"></span>
          )}
        </div>
      </div>

      <div className="modal-backdrop">
        <button onClick={props.onClose}>close</button>
      </div>
    </React.Fragment>
  );
}

interface AnswerListItemProps {
  question: string;
  answer: string;
  type: SectionType;
}
function AnswerListItem(props: AnswerListItemProps) {
  switch (props.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'range':
    case 'multiple-choice':
      return (
        <li className="list-row">
          <div>
            <div>{props.question}</div>
            <div className="text-xs uppercase font-semibold opacity-60 whitespace-break-spaces">
              {props.answer}
            </div>
          </div>
        </li>
      );

    case 'boolean':
      return (
        <li className="list-row">
          <div>
            <div>{props.question}</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              {Boolean(props.answer) ? 'Yes' : 'No'}
            </div>
          </div>
        </li>
      );

    case 'link':
      return (
        <li className="list-row">
          <div>
            <div>{props.question}</div>
            <Link
              className="text-xs uppercase font-semibold opacity-60 hover:underline"
              href={props.answer}
              target="_blank"
            >
              {props.answer}
            </Link>
          </div>
        </li>
      );

    case 'file':
      return (
        <li className="list-row overflow-hidden">
          <div className="max-w-full overflow-hidden text-ellipsis">
            <div>{props.question}</div>
            <Link
              className="text-xs uppercase font-semibold opacity-60 hover:underline whitespace-nowrap"
              href={props.answer}
              target="_blank"
            >
              {props.answer}
            </Link>
          </div>
        </li>
      );
  }
}

const ResponseContext = React.createContext<{
  response: ResponseDto | null;
  setResponse: React.Dispatch<React.SetStateAction<ResponseDto | null>>;
}>({
  response: null,
  setResponse: () => {},
});

export const ResponseConsumer = ResponseContext.Consumer;

export function ResponseProvider(props: React.PropsWithChildren) {
  const [response, setResponse] = React.useState<ResponseDto | null>(null);

  return (
    <ResponseContext.Provider value={{ response, setResponse }}>
      <ResponseModal />

      {props.children}
    </ResponseContext.Provider>
  );
}

export function useResponseContext() {
  return React.useContext(ResponseContext);
}

const modalName = 'response-modal';

export const closeResponseModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).close();

export const openResponseModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).showModal();
