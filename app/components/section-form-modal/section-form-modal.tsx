'use client';

import React from 'react';
import { Section, SectionType, sectionTypes } from 'models/form';
import { Forms } from './forms';
import { useSectionFormContext } from './section-form-modal.context';
import { getSectionDefaultValues } from './section-form-modal.utils';

export interface SectionFormModalProps {
  onSubmit: (data: Section) => void;
}

export function SectionFormModal(props: SectionFormModalProps) {
  const addSectionContext = useSectionFormContext();

  return (
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

        <Forms onSubmit={props.onSubmit} />
      </div>
    </dialog>
  );
}

const modalName = 'add-section-modal';

export const closeAddSectionModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).close();

export const openAddSectionModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).showModal();
