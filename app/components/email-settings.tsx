'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useEmailSettings,
  useUpdateEmailSettings,
} from 'hooks/use-email-settings';
import {
  UpdateEmailSettings,
  updateEmailSettingsSchema,
} from 'models/email-settings';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledBooleanInput, ControlledCheckbox } from './inputs';
import React from 'react';

export function EmailSettings() {
  const form = useForm<UpdateEmailSettings>({
    resolver: zodResolver(updateEmailSettingsSchema),
    defaultValues: {
      marketing: true,
      productUpdates: true,
    },
  });

  const emailSettings = useEmailSettings();

  const updateEmailSettings = useUpdateEmailSettings();

  const saveChanges = form.handleSubmit(async (data) => {
    await updateEmailSettings.updateEmailSettings(data);
  });

  React.useEffect(() => {
    form.reset({
      marketing: emailSettings.data?.marketing ?? true,
      productUpdates: emailSettings.data?.productUpdates ?? true,
    });
  }, [emailSettings.data]);

  if (emailSettings.isLoading) {
    return (
      <div className="card w-96 bg-base-100 card-xs shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title">Email Settings</h2>

          <span className="mx-auto loading loading-ring loading-xl"></span>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="card w-96 bg-base-100 card-xs shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title">Email Settings</h2>

          <ControlledCheckbox
            label="Product updates"
            name="productUpdates"
            disabled={form.formState.isSubmitting}
          />

          <ControlledCheckbox
            label="Marketing Email"
            name="marketing"
            disabled={form.formState.isSubmitting}
          />

          {form.formState.isDirty && (
            <div className="justify-end card-actions">
              <button
                disabled={form.formState.isSubmitting}
                onClick={saveChanges}
                className="btn btn-primary w-fit"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
