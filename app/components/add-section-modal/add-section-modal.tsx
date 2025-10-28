'use client';

import React from 'react';
import { sectionTypes } from './add-section-modal.types';

export function AddSectionModal() {
  const modalName = 'add-section-modal';
  // @ts-expect-error
  const openModal = () => document.getElementById(modalName).showModal();

  return (
    <React.Fragment>
      <button className="btn" onClick={openModal}>
        Add section
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
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>

      <dialog id={modalName} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Add section</h3>

          <select defaultValue="" className="select w-full">
            <option disabled={true}>Section type</option>
            {sectionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            <button className="btn btn-primary">Add Section</button>
          </div>
        </div>
      </dialog>
    </React.Fragment>
  );
}
