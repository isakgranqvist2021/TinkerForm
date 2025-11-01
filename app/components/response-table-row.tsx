'use client';

import { SelectedResponse } from 'db/schema';
import { openResponseModal, ResponseConsumer } from './response-modal';
import { calculateDuration, formatDate, formatDuration } from 'utils';

interface ResponseTableRowProps {
  response: SelectedResponse;
  index: number;
}

export function ResponseTableRow(props: ResponseTableRowProps) {
  const duration = calculateDuration(
    props.response.created_at,
    props.response.completed_at,
  );

  return (
    <ResponseConsumer>
      {(ctx) => {
        return (
          <tr
            key={props.response.id}
            className={
              'hover:bg-base-200 cursor-pointer ' +
              (ctx.response?.id === props.response.id ? 'bg-base-300' : '')
            }
            onClick={() => {
              ctx.setResponse(props.response);
              openResponseModal();
            }}
          >
            <td>{props.index + 1}</td>
            <td>{formatDate(props.response.created_at)}</td>
            <td>{duration ? formatDuration(duration) : ''}</td>
          </tr>
        );
      }}
    </ResponseConsumer>
  );
}
