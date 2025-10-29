'use client';

import React from 'react';
import { Section, SectionType, sectionTypes } from './add-section-modal.types';
import { Forms } from './forms';
import { getSectionDefaultValues } from './add-section-modal.utils';

const modalName = 'add-section-modal';

export function AddSectionModal() {
  // @ts-expect-error
  const openModal = () => document.getElementById(modalName).showModal();

  const [selectedSectionType, setSelectedSectionType] =
    React.useState<SectionType>('text');

  const defaultValues = getSectionDefaultValues(
    selectedSectionType,
    crypto.randomUUID(),
    0,
  );

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
        <div className="modal-box flex flex-col w-8/12 max-w-5xl">
          <h3 className="font-bold text-lg">Add section</h3>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Section type</legend>

            <select
              value={selectedSectionType}
              className="select w-full"
              onChange={(e) =>
                setSelectedSectionType(e.target.value as SectionType)
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

          <Forms defaultValues={defaultValues} />
        </div>
      </dialog>
    </React.Fragment>
  );
}
