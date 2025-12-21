'use client';

import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import React from 'react';

export function EditTeamSettingsButton() {
  return (
    <React.Fragment>
      <div className="tooltip" data-tip="Edit team settings">
        <button
          className="btn btn-neutral btn-circle btn-sm sm:btn-md"
          onClick={openEditTeamSettingsModal}
        >
          <Cog8ToothIcon className="size-6" />
        </button>
      </div>

      <dialog id={modalName} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
    </React.Fragment>
  );
}

const modalName = 'edit-team-settings-modal';

const closeEditTeamSettingsModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).close();

const openEditTeamSettingsModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).showModal();
