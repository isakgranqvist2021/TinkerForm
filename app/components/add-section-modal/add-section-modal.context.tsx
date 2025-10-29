'use client';

import React from 'react';
import { Section } from 'models/form';
import { getSectionDefaultValues } from './add-section-modal.utils';
import { closeModal } from './add-section-modal';
import { toast } from 'sonner';

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

  submitForm: () => Promise<void>;
  isLoading: boolean;
}>({
  sections: [],
  addSection: () => {},
  removeSection: () => {},
  setSections: () => {},

  defaultValues: getSectionDefaultValues('text'),
  setDefaultValues: (defaultValues: Section) => {},

  mode: 'add',
  setMode: () => {},

  submitForm: async () => {},
  isLoading: false,
});

interface AddSectionProviderProps {
  children: React.ReactNode;
  defaultValue: Section[];
}

export function AddSectionProvider(props: AddSectionProviderProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>('add');
  const [sections, setSections] = React.useState<Section[]>(props.defaultValue);
  const [defaultValues, setDefaultValues] = React.useState<Section>(
    getSectionDefaultValues('text'),
  );

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

  const submitForm = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/forms/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections }),
      });

      if (!res.ok) {
        throw new Error('Failed to create form');
      }

      toast.success('Form created successfully!');
    } catch (error) {
      toast.error("Couldn't create form. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        submitForm,
        isLoading,
      }}
    >
      {props.children}
    </AddSectionContext.Provider>
  );
}

export function useAddSectionContext() {
  return React.useContext(AddSectionContext);
}
