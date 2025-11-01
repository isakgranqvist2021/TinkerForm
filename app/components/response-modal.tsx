'use client';

import { Response } from 'db/schema';
import React from 'react';
import { calculateDuration, formatDate, formatDuration } from 'utils';

function ResponseModal() {
  const responseContext = useResponseContext();

  return (
    <dialog id={modalName} className="modal">
      {responseContext.response && (
        <ResponseModalContent
          response={responseContext.response}
          onClose={() => {
            closeResponseModal();

            // Delay clearing the responseId to allow the modal close animation to finish
            window.setTimeout(() => {
              responseContext.setResponse(null);
            }, 300);
          }}
        />
      )}
    </dialog>
  );
}

interface ResponseModalContentProps {
  response: Response;
  onClose: () => void;
}

function ResponseModalContent(props: ResponseModalContentProps) {
  const duration = calculateDuration(
    props.response.created_at,
    props.response.completed_at,
  );

  return (
    <React.Fragment>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Response</h3>
        <p>Date: {formatDate(props.response.created_at)}</p>
        <p>Completion time: {duration ? formatDuration(duration) : 'N/A'}</p>
      </div>
      <div className="modal-backdrop">
        <button onClick={props.onClose}>close</button>
      </div>
    </React.Fragment>
  );
}

const ResponseContext = React.createContext<{
  response: Response | null;
  setResponse: React.Dispatch<React.SetStateAction<Response | null>>;
}>({
  response: null,
  setResponse: () => {},
});

export const ResponseConsumer = ResponseContext.Consumer;

export function ResponseProvider(props: React.PropsWithChildren) {
  const [response, setResponse] = React.useState<Response | null>(null);

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
