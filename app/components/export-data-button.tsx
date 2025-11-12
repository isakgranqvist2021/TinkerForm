'use client';

import { toast } from 'sonner';
import useMutation from 'swr/mutation';

interface ExportDataButtonProps {
  formId: string;
}

export function ExportDataButton(props: ExportDataButtonProps) {
  const { isMutating, trigger } = useMutation(
    `/api/forms/${props.formId}/export`,
    async (url: string) => {
      return await fetch(url);
    },
    {
      onSuccess: (res) => {
        res.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${props.formId}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        });
      },
      onError: () => {
        toast.error("Couldn't export form data. Please try again.");
      },
    },
  );

  return (
    <button
      className="btn btn-circle"
      onClick={() => trigger()}
      disabled={isMutating}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </button>
  );
}
