import React from 'react';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';
import { FormTheme } from './form-theme';
import { UploadCoverImage } from './upload-cover-image';
import { FormAvailability } from './form-availability';

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
