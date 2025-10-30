'use client';

import React from 'react';
import { Section } from 'models/form';
import { getSectionDefaultValues } from './section-form-modal.utils';
import { AddNewFormProps } from 'components/add-new-form/add-new-form';

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

interface SectionFormProviderProps extends AddNewFormProps {
  children: React.ReactNode;
}

export function SectionFormProvider(props: SectionFormProviderProps) {
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
