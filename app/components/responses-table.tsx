'use client';

import { ResponseDto } from 'services/api/response';
import { EmptyState } from './empty-state';
import { ResponseTableRow } from './response-table-row';
import React from 'react';

interface ResponsesTableProps {
  responses: ResponseDto[];
}

export function ResponsesTable(props: ResponsesTableProps) {
  const [onlyShowCompleted, setOnlyShowCompleted] = React.useState(false);

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
      <label className="label">
        <input
          type="checkbox"
          className="toggle"
          checked={onlyShowCompleted}
          onChange={(e) => setOnlyShowCompleted(e.target.checked)}
        />
        Only show completed
      </label>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Completion Time</th>
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
              .map((response, index) => (
                <ResponseTableRow
                  key={response.id}
                  response={response}
                  index={index}
                />
              ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
