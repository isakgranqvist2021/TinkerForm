'use client';

import { openResponseModal, ResponseConsumer } from './response-modal';
import { calculateDuration, formatDate, formatDuration } from 'utils';
import { ResponseDto } from 'services/api/response';

interface ResponseTableRowProps {
  response: ResponseDto;
  index: number;
}

export function ResponseTableRow(props: ResponseTableRowProps) {
  const duration = calculateDuration(
    props.response.createdAt,
    props.response.completedAt,
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
            <td>{formatDate(props.response.createdAt)}</td>
            <td>{duration ? formatDuration(duration) : ''}</td>
          </tr>
        );
      }}
    </ResponseConsumer>
  );
}
