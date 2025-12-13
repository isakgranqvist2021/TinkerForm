'use client';

import { Theme } from 'config/theme';
import { useChangeTheme } from 'hooks/use-change-theme';
import { Form } from 'models/form';
import { useFormContext } from 'react-hook-form';

export function FormTheme() {
  const formContext = useFormContext<Form>();

  const value = formContext.watch('theme');

  const changeTheme = useChangeTheme();

  return (
    <fieldset className="fieldset">
      <div className="flex flex-wrap gap-4">
        {Object.values(Theme).map((theme) => (
          <label key={theme} className="flex gap-2 cursor-pointer items-center">
            <input
              readOnly
              name="theme-radio"
              type="radio"
              className="radio radio-sm"
              checked={value === theme}
              onClick={() => {
                formContext.setValue('theme', theme);
                changeTheme(theme);
              }}
            />
            {theme}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
