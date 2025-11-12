'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import useMutation from 'swr/mutation';

interface FormIdProps {
  formId: string;
}

interface FormLinkProps {
  viewFormHref: string;
}

interface FormActionsProps extends FormIdProps, FormLinkProps {}

export function FormActions(props: FormActionsProps) {
  return (
    <React.Fragment>
      <DeleteFormModal formId={props.formId} />

      <div className="flex gap-4 hidden md:flex">
        <ViewFormButton viewFormHref={props.viewFormHref} />

        <CopyFormLink viewFormHref={props.viewFormHref} />

        <DeleteFormIconButton
          className="btn btn-circle"
          formId={props.formId}
        />

        <ExportDataButton formId={props.formId} />

        <EditFormButton formId={props.formId} />
      </div>

      <div className="dropdown dropdown-end flex md:hidden">
        <FormActionsMenu {...props} />
      </div>
    </React.Fragment>
  );
}

function DeleteFormModal(props: FormIdProps) {
  const { isLoading, deleteForm } = useDeleteForm({ formId: props.formId });

  return (
    <dialog id={modalName} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Form</h3>
        <p className="py-4">
          Are you sure you want to delete this form? This action cannot be
          undone.
        </p>

        <div className="modal-action">
          <button className="btn">
            <span onClick={closeDeleteFormModal}>Cancel</span>
          </button>
          <button className="btn btn-error">
            <span onClick={deleteForm}>
              {isLoading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                'Delete'
              )}
            </span>
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function FormActionsMenu(props: FormActionsProps) {
  const exportData = useExportData({ formId: props.formId });
  const copyToClipboard = useCopyFormLink({ viewFormHref: props.viewFormHref });

  return (
    <React.Fragment>
      <div tabIndex={0} role="button" className="btn btn-circle m-1">
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <a href={props.viewFormHref}>View form</a>
        </li>
        <li>
          <a onClick={copyToClipboard}>Copy form link</a>
        </li>
        <li>
          <a onClick={() => exportData.trigger()}>Export CSV</a>
        </li>
        <li>
          <Link href={`/dashboard/forms/${props.formId}/edit`}>Edit Form</Link>
        </li>
        <li onClick={openDeleteFormModal}>
          <a>Delete form</a>
        </li>
      </ul>
    </React.Fragment>
  );
}

function useExportData(props: FormIdProps) {
  return useMutation(
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
}

function ExportDataButton(props: FormIdProps) {
  const { isMutating, trigger } = useExportData(props);

  return (
    <div className="tooltip" data-tip="Download responses as CSV">
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
    </div>
  );
}

function useDeleteForm(props: FormIdProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const deleteForm = async () => {
    setIsLoading(true);

    const res = await fetch(`/api/forms/${props.formId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      toast.error('Error deleting form');
      return;
    }

    router.replace('/dashboard/forms');
    toast.success('Form deleted successfully');

    closeDeleteFormModal();

    setIsLoading(false);
  };

  return { isLoading, deleteForm };
}

interface DeleteFormButtonProps
  extends React.ComponentProps<'button'>,
    FormIdProps {}

export function DeleteFormIconButton(props: DeleteFormButtonProps) {
  const { formId, ...rest } = props;

  return (
    <div className="tooltip" data-tip="Delete">
      <button
        className="btn btn-square btn-ghost"
        onClick={openDeleteFormModal}
        {...rest}
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}

function useCopyFormLink(props: FormLinkProps) {
  return async () => {
    try {
      await navigator.clipboard.writeText(props.viewFormHref);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
}

export function CopyFormLink(props: FormLinkProps) {
  const copyToClipboard = useCopyFormLink(props);

  return (
    <div className="tooltip" data-tip="Copy Link">
      <button className="btn btn-circle" onClick={copyToClipboard}>
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
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
          />
        </svg>
      </button>
    </div>
  );
}

function ViewFormButton(props: FormLinkProps) {
  return (
    <div className="tooltip" data-tip="Visit form">
      <a
        className="btn btn-circle"
        href={props.viewFormHref}
        target="_blank"
        rel="noopener noreferrer"
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
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </a>
    </div>
  );
}

function EditFormButton(props: FormIdProps) {
  return (
    <div className="tooltip" data-tip="Edit">
      <Link
        className="btn btn-circle"
        href={`/dashboard/forms/${props.formId}/edit`}
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </Link>
    </div>
  );
}

const modalName = 'delete-form-modal';

const closeDeleteFormModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).close();

const openDeleteFormModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).showModal();
