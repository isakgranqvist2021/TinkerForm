import { Form, type FormAvailability } from 'models/form';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ControlledInput } from './inputs';
import { cn, formatDateInput } from 'utils';

export function FormAvailability() {
  const formContext = useFormContext<Form>();

  const formAvailability = formContext.watch('availability');

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const availability = e.target.value as FormAvailability;

    const options = {
      shouldDirty: true,
      shouldValidate: formContext.formState.isSubmitted,
    };

    const values = formContext.getValues([
      'maxResponses',
      'startDate',
      'endDate',
    ]);

    const [maxResponses, startDate, endDate] = values;

    if (typeof maxResponses !== 'number' || isNaN(maxResponses)) {
      formContext.setValue('maxResponses', 0, options);
    }

    if (typeof startDate !== 'string' || isNaN(new Date(startDate).getTime())) {
      formContext.setValue('startDate', formatDateInput(new Date()), options);
    }

    if (typeof endDate !== 'string' || isNaN(new Date(endDate).getTime())) {
      formContext.setValue('endDate', formatDateInput(new Date()));
    }

    formContext.setValue('availability', availability, options);
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4">
        <label className="flex">
          <input
            onChange={handleRadioChange}
            value="always"
            type="radio"
            name="radio-1"
            className="radio"
            defaultChecked={formAvailability === 'always'}
          />

          <div className="ml-4">
            <span className="label">Always Available</span>
            <p>
              The form will be accessible at all times unless you manually end
              it
            </p>
          </div>
        </label>

        <label className="flex">
          <input
            onChange={handleRadioChange}
            value="dates"
            type="radio"
            name="radio-1"
            className="radio"
            defaultChecked={formAvailability === 'dates'}
          />

          <div className="ml-4">
            <span className="label">Specific Date</span>
            <p>Set a start and end date for when the form is available</p>
          </div>
        </label>

        <label className="flex">
          <input
            onChange={handleRadioChange}
            value="responses"
            type="radio"
            name="radio-1"
            className="radio"
            defaultChecked={formAvailability === 'responses'}
          />

          <div className="ml-4">
            <span className="label">Number of Responses</span>
            <p>
              Make the form available until a certain number of responses is
              reached
            </p>
          </div>
        </label>
      </div>

      <ExtraFieldsForAvailability />
    </div>
  );
}

function ExtraFieldsForAvailability() {
  const formContext = useFormContext<Form>();

  const formAvailability = formContext.watch('availability');

  return (
    <div>
      <div
        className={cn(
          'mt-4 gap-4',
          formAvailability === 'dates' ? 'flex' : 'hidden',
        )}
      >
        <ControlledInput
          label="Start Date"
          type="datetime-local"
          name="startDate"
        />

        <ControlledInput
          label="End Date"
          type="datetime-local"
          name="endDate"
        />
      </div>

      <div
        className={cn(
          'mt-4',
          formAvailability === 'responses' ? 'block' : 'hidden',
        )}
      >
        <ControlledInput
          label="Max Responses"
          type="number"
          name="maxResponses"
        />
      </div>
    </div>
  );
}
