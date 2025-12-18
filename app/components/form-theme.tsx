'use client';

import { PackageId } from 'config/packages';
import { Theme } from 'config/theme';
import { useChangeTheme } from 'hooks/use-change-theme';
import { Form } from 'models/form';
import Link from 'next/link';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormThemeProps {
  packageId?: PackageId;
}
export function FormTheme(props: FormThemeProps) {
  const formContext = useFormContext<Form>();

  const value = formContext.watch('theme');

  const changeTheme = useChangeTheme();

  const disableChooseTheme = !props.packageId || props.packageId === 'starter';

  return (
    <React.Fragment>
      <fieldset className="fieldset">
        <div className="flex flex-wrap gap-4">
          {Object.values(Theme).map((theme) => (
            <label
              key={theme}
              className="flex gap-2 cursor-pointer items-center"
            >
              <input
                readOnly
                name="theme-radio"
                type="radio"
                className="radio radio-sm"
                checked={value === theme}
                onClick={() => {
                  formContext.setValue('theme', theme, {
                    shouldDirty: true,
                    shouldValidate: formContext.formState.isSubmitted,
                  });
                  changeTheme(theme);
                }}
                disabled={disableChooseTheme}
              />
              {theme}
            </label>
          ))}
        </div>
      </fieldset>

      {disableChooseTheme && (
        <div className="flex gap-2 mt-2">
          <p className="text-sm w-fit grow-[unset] text-warning">
            Upgrade your package to unlock more themes.
          </p>

          <Link href="/pricing" className="link text-sm">
            View Pricing
          </Link>
        </div>
      )}
    </React.Fragment>
  );
}
