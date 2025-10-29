'use client';

import React from 'react';
import { SectionType, sectionTypes } from 'models/form';
import { Forms } from './forms';

import { useAddSectionContext } from './add-section-modal.context';
import { getSectionDefaultValues } from './add-section-modal.utils';
import { AddSectionButton } from './add-section-button';

export function AddSectionModal() {
  const addSectionContext = useAddSectionContext();

  return (
    <React.Fragment>
      {addSectionContext.sections.length > 0 && <AddSectionButton />}

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
