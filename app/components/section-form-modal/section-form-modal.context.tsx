'use client';

import React from 'react';
import { Form, Section } from 'models/form';
import { getSectionDefaultValues } from './section-form-modal.utils';

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
