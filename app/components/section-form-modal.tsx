'use client';

import React from 'react';
import { Section, SectionType, sectionTypes } from 'models/form';
import { Forms } from './forms';

export interface SectionFormModalProps {
  onSubmit: (data: Section) => void;
}

export function SectionFormModal(props: SectionFormModalProps) {
  const addSectionContext = useSectionFormContext();

  return (
    <dialog id={modalName} className="modal">
      <div className="modal-box flex flex-col w-8/12 max-w-6xl">
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
                {formatType(type)}
              </option>
            ))}
          </select>

          <p className="label">
            When someone fills out your form, the answer they provide will be in
            this format.
          </p>
        </fieldset>

        <Forms onSubmit={props.onSubmit} />
      </div>
    </dialog>
  );
}

function formatType(type: SectionType) {
  switch (type) {
    case 'boolean':
      return 'True / False';

    case 'multiple-choice':
      return 'Multiple Choice';

    case 'email':
      return 'Email';

    case 'file':
      return 'File';

    case 'link':
      return 'Link';

    case 'phone':
      return 'Phone Number';

    case 'range':
      return 'Range (Number)';

    case 'text':
      return 'Text';
  }
}

export type FormMode = 'edit' | 'add';

const SectionFormContext = React.createContext<{
  defaultValues: Section;
  setDefaultValues: (defaultValues: Section) => void;

  mode: FormMode;
  setMode: React.Dispatch<React.SetStateAction<FormMode>>;
}>({
  defaultValues: getSectionDefaultValues('text'),
  setDefaultValues: (defaultValues: Section) => {},

  mode: 'add',
  setMode: () => {},
});

export function SectionFormProvider(props: React.PropsWithChildren) {
  const [mode, setMode] = React.useState<FormMode>('add');
  const [defaultValues, setDefaultValues] = React.useState<Section>(
    getSectionDefaultValues('text'),
  );

  return (
    <SectionFormContext.Provider
      value={{
        defaultValues,
        setDefaultValues,
        mode,
        setMode,
      }}
    >
      {props.children}
    </SectionFormContext.Provider>
  );
}

export function useSectionFormContext() {
  return React.useContext(SectionFormContext);
}

export function getSectionDefaultValues(type: SectionType): Section {
  switch (type) {
    case 'text':
    case 'range':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
        min: 0,
        max: 0,
      };

    case 'boolean':
    case 'email':
    case 'file':
    case 'link':
    case 'phone':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
      };

    case 'multiple-choice':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
        options: [],
      };
  }
}

const modalName = 'add-section-modal';

export const closeAddSectionModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).close();

export const openAddSectionModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).showModal();
