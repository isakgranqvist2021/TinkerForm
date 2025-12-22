import React from 'react';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';
import { FormTheme } from './form-theme';
import { UploadImage } from './upload-cover-image';
import { FormAvailability } from './form-availability';
import { useFormContext } from 'react-hook-form';
import { Form } from 'models/form';

export function FormSections() {
  return (
    <React.Fragment>
      <div className="card sm:shadow-sm">
        <div className="card-body p-0 sm:p-6">
          <div>
            <h3 className="card-title">1. Form Theme</h3>
            <p>Choose a theme for your form to match your brand.</p>
          </div>

          <FormTheme />
        </div>
      </div>

      <div className="card sm:shadow-sm">
        <div className="card-body p-0 sm:p-6">
          <div>
            <h3 className="card-title">2. Cover Image</h3>
            <p>Upload a cover image to make your form stand out.</p>
          </div>

          <UploadCoverImage />
        </div>
      </div>

      <div className="card sm:shadow-sm">
        <div className="card-body p-0 sm:p-6">
          <div className="mb-2">
            <div className="card-title">3. Form Details</div>
            <p>Describe your form so users know what to expect.</p>
          </div>

          <FormDetails />
        </div>
      </div>

      <div className="card sm:shadow-sm">
        <div className="card-body p-0 sm:p-6">
          <div>
            <h3 className="card-title">4. Availability</h3>
            <p>Set availability for your form.</p>
          </div>

          <FormAvailability />
        </div>
      </div>

      <div className="card sm:shadow-sm">
        <div className="card-body p-0 sm:p-6">
          <div>
            <h3 className="card-title">5. Sections</h3>
            <p>Add sections to your form that the user can fill out.</p>
          </div>

          <SectionsList />
        </div>
      </div>
    </React.Fragment>
  );
}

function UploadCoverImage() {
  const formContext = useFormContext<Form>();

  const coverImage = formContext.watch('coverImage');

  const handleImageChange = (file: File | null) => {
    formContext.setValue('coverImage', file ?? new File([], ''), {
      shouldValidate: formContext.formState.isSubmitted,
      shouldDirty: true,
    });
  };

  return (
    <React.Fragment>
      <UploadImage
        label="Cover image"
        file={coverImage}
        onChange={handleImageChange}
      />

      <div className="mt-2">
        {formContext.formState.errors.coverImage && (
          <p className="text-error">
            {formContext.formState.errors.coverImage.message}
          </p>
        )}
      </div>
    </React.Fragment>
  );
}
