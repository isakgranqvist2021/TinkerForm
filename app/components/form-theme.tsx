'use client';

import { Theme } from 'config/theme';
import { Form } from 'models/form';
import { useFormContext } from 'react-hook-form';

export function FormTheme() {
  const formContext = useFormContext<Form>();

  const value = formContext.watch('theme');

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Pick a theme for your form</legend>
      <select
        disabled={formContext.formState.isSubmitting}
        defaultValue="Pick a theme"
        className="select"
        value={value}
        onChange={(e) => {
          document.documentElement.setAttribute('data-theme', e.target.value);
          formContext.setValue('theme', e.target.value as Theme);
        }}
      >
        <option disabled={true}>Pick a theme</option>
        {Object.values(Theme).map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
