import React from 'react';
import { FormDetails } from './form-details';
import { SectionsList } from './sections-list';
import { FormTheme } from './form-theme';

export function FormSections() {
  return (
    <React.Fragment>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-2">
            <div className="card-title">1. Form Details</div>
            <p>Describe your form so users know what to expect.</p>
          </div>

          <FormDetails />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div>
            <h3 className="card-title">2. Form Theme</h3>
            <p>Choose a theme for your form to match your brand.</p>
          </div>

          <FormTheme />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div>
            <h3 className="card-title">3. Sections</h3>
            <p>Add sections to your form that the user can fill out.</p>
          </div>

          <SectionsList />
        </div>
      </div>
    </React.Fragment>
  );
}
