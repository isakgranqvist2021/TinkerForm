'use client';

import React from 'react';
import { Section, SectionType } from './add-section-modal.types';
import { getSectionDefaultValues } from './add-section-modal.utils';
import { closeModal } from './add-section-modal';

type Mode = 'edit' | 'add';
const AddSectionContext = React.createContext<{
  sections: Section[];
  addSection: (section: Section) => void;
  removeSection: (id: string) => void;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;

  defaultValues: Section;
  setDefaultValues: (defaultValues: Section) => void;

  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}>({
  sections: [],
  addSection: () => {},
  removeSection: () => {},
  setSections: () => {},

  defaultValues: getSectionDefaultValues('text'),
  setDefaultValues: (defaultValues: Section) => {},

  mode: 'add',
  setMode: () => {},
});

interface AddSectionProviderProps {
  children: React.ReactNode;
  defaultValue: Section[];
}

export function AddSectionProvider(props: AddSectionProviderProps) {
  const [sections, setSections] = React.useState<Section[]>(props.defaultValue);

  const [defaultValues, setDefaultValues] = React.useState<Section>(
    getSectionDefaultValues('text'),
  );

  const [mode, setMode] = React.useState<Mode>('add');

  const addSection = (section: Section) => {
    if (mode === 'edit') {
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? section : s)),
      );
    } else {
      setSections((prev) => [
        ...prev,
        {
          ...section,
          id: crypto.randomUUID(),
        },
      ]);
    }

    closeModal();
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AddSectionContext.Provider
      value={{
        sections,
        addSection,
        removeSection,
        setSections,
        defaultValues,
        setDefaultValues,
        mode,
        setMode,
      }}
    >
      {props.children}
    </AddSectionContext.Provider>
  );
}

export function useAddSectionContext() {
  return React.useContext(AddSectionContext);
}
