'use client';

import { useClipboard } from 'hooks/use-clipboard';
import {
  DeleteFormContextProvider,
  useDeleteFormContext,
} from 'hooks/use-delete-form';
import { useExportData } from 'hooks/use-export-responses';
import { usePauseForm } from 'hooks/use-pause-form';
import Link from 'next/link';
import React from 'react';
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  EyeIcon,
  PauseIcon,
  PencilSquareIcon,
  PlayIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { PackageId } from 'config/packages';

interface FormActionsProps
  extends ViewFormButtonProps,
    PauseFormButtonProps,
    CopyFormLinkProps,
    DeleteFormButtonProps,
    ExportDataButtonProps,
    EditFormButtonProps {}

export function FormActions(props: FormActionsProps) {
  return (
    <DeleteFormContextProvider>
      <FormActionsButtons {...props} />

      <FormActionsMenu {...props} />
    </DeleteFormContextProvider>
  );
}

function FormActionsButtons(props: FormActionsProps) {
  return (
    <div className="flex gap-4 hidden md:flex">
      <ViewFormButton viewFormHref={props.viewFormHref} />

      <PauseFormButton
        className="btn btn-circle"
        formId={props.formId}
        pausedAt={props.pausedAt}
      />

      <CopyFormLink viewFormHref={props.viewFormHref} />

      <DeleteFormButton className="btn btn-circle" formId={props.formId} />

      <ExportDataButton formId={props.formId} packageId={props.packageId} />

      <EditFormButton formId={props.formId} />
    </div>
  );
}

function FormActionsMenu(props: FormActionsProps) {
  const exportData = useExportData(props.formId);
  const copyToClipboard = useClipboard(props.viewFormHref);
  const pauseForm = usePauseForm(props.formId);
  const deleteFormContext = useDeleteFormContext();

  return (
    <div className="dropdown dropdown-end flex md:hidden">
      <div tabIndex={0} role="button" className="btn btn-circle m-1">
        <Bars3Icon className="size-6" />
      </div>
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <a href={props.viewFormHref}>View form</a>
        </li>
        <li>
          <div className="flex justify-between items-center">
            <a onClick={pauseForm.pauseForm}>
              {props.pausedAt ? 'Resume form' : 'Pause form'}
            </a>

            {pauseForm.isLoading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </div>
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
        <li onClick={() => deleteFormContext.openModal(props.formId)}>
          <a>Delete form</a>
        </li>
      </ul>
    </div>
  );
}

interface ExportDataButtonProps {
  packageId?: PackageId;
  formId: string;
}
function ExportDataButton(props: ExportDataButtonProps) {
  const { isMutating, trigger } = useExportData(props.formId);

  if (props.packageId !== 'pro') {
    return (
      <div className="tooltip" data-tip="Upgrade to Pro to export responses">
        <button className="btn btn-circle" disabled>
          <ArrowDownTrayIcon className="size-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="tooltip" data-tip="Download responses as CSV">
      <button
        className="btn btn-circle"
        onClick={() => trigger()}
        disabled={isMutating}
      >
        <ArrowDownTrayIcon className="size-6" />
      </button>
    </div>
  );
}

interface DeleteFormButtonProps extends React.ComponentProps<'button'> {
  formId: string;
}
export function DeleteFormButton(props: DeleteFormButtonProps) {
  const { formId, ...rest } = props;

  const deleteFormContext = useDeleteFormContext();

  return (
    <div className="tooltip" data-tip="Delete">
      <button
        className="btn btn-square btn-ghost"
        onClick={() => deleteFormContext.openModal(formId)}
        {...rest}
      >
        <TrashIcon className="size-6" />
      </button>
    </div>
  );
}

interface CopyFormLinkProps {
  viewFormHref: string;
}
export function CopyFormLink(props: CopyFormLinkProps) {
  const copyToClipboard = useClipboard(props.viewFormHref);

  return (
    <div className="tooltip" data-tip="Copy Link">
      <button className="btn btn-circle" onClick={copyToClipboard}>
        <ShareIcon className="size-6" />
      </button>
    </div>
  );
}

interface ViewFormButtonProps {
  viewFormHref: string;
}
function ViewFormButton(props: ViewFormButtonProps) {
  return (
    <div className="tooltip" data-tip="Visit form">
      <a
        className="btn btn-circle"
        href={props.viewFormHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <EyeIcon className="size-6" />
      </a>
    </div>
  );
}

interface EditFormButtonProps {
  formId: string;
}
function EditFormButton(props: EditFormButtonProps) {
  return (
    <div className="tooltip" data-tip="Edit">
      <Link
        className="btn btn-circle"
        href={`/dashboard/forms/${props.formId}/edit`}
      >
        <PencilSquareIcon className="size-6" />
      </Link>
    </div>
  );
}

interface PauseFormButtonProps extends React.ComponentProps<'button'> {
  pausedAt: string | null;
  formId: string;
}
export function PauseFormButton(props: PauseFormButtonProps) {
  const { pausedAt, formId, ...rest } = props;

  const { pauseForm, isLoading } = usePauseForm(formId);

  return (
    <div className="tooltip" data-tip={pausedAt ? 'Resume' : 'Pause'}>
      <button
        disabled={isLoading}
        className="btn btn-square btn-ghost"
        onClick={pauseForm}
        {...rest}
      >
        {isLoading ? (
          <span className="loading loading-dots loading-sm"></span>
        ) : pausedAt ? (
          <PlayIcon className="size-6" />
        ) : (
          <PauseIcon className="size-6" />
        )}
      </button>
    </div>
  );
}
