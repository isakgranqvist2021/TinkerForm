'use client';

import React from 'react';
import { SectionType, sectionTypes } from './add-section-modal.types';
import { Forms } from './forms';

import { useAddSectionContext } from './add-section-modal.context';
import { getSectionDefaultValues } from './add-section-modal.utils';

export function AddSectionModal() {
  const addSectionContext = useAddSectionContext();

  return (
    <React.Fragment>
      <button
        className="btn w-fit"
        onClick={() => {
          openModal();
          addSectionContext.setMode('add');
          addSectionContext.setDefaultValues(getSectionDefaultValues('text'));
        }}
      >
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
        <div className="modal-box flex flex-col w-8/12 max-w-5xl">
          <h3 className="font-bold text-lg">
            {addSectionContext.mode === 'add'
              ? 'Add new section'
              : 'Edit section'}
          </h3>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Section type</legend>

            <select
              value={addSectionContext.defaultValues.type}
              className="select w-full"
              onChange={(e) =>
                addSectionContext.setDefaultValues(
                  getSectionDefaultValues(e.target.value as SectionType),
                )
              }
            >
              <option disabled={true}>Section type</option>
              {sectionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </fieldset>

          <Forms />
        </div>
      </dialog>
    </React.Fragment>
  );
}

const modalName = 'add-section-modal';

// @ts-expect-error
export const closeModal = () => document.getElementById(modalName).close();
// @ts-expect-error
export const openModal = () => document.getElementById(modalName).showModal();
