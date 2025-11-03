import React from 'react';
import { useController } from 'react-hook-form';
import { Editor } from 'primereact/editor';

interface ControlledComponentProps {
  label: string;
  placeholder?: string;
  name: string;
  description?: string;
}

export function ControlledInput(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  const error = controller.fieldState.error?.message;

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{props.label}</legend>

      <input
        type="text"
        className="input w-full"
        {...rest}
        {...controller.field}
        onChange={(e) => {
          if (rest.type == 'number') {
            controller.field.onChange(e.target.valueAsNumber);
          } else {
            controller.field.onChange(e.target.value);
          }
        }}
      />

      <div className="flex justify-between">
        {error ? (
          <p className="text-error">{error}</p>
        ) : (
          <p className="label">{props.description}</p>
        )}

        {props.maxLength && (
          <div className="label">
            {controller.field.value ? controller.field.value.length : 0} /{' '}
            {props.maxLength}
          </div>
        )}
      </div>
    </fieldset>
  );
}

export function ControlledTextarea(
  props: ControlledComponentProps &
    React.ComponentProps<'textarea'> & { rich?: boolean },
) {
  const { name, label, rich, ...rest } = props;

  const controller = useController({ name });

  const error = controller.fieldState.error?.message;

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{props.label}</legend>

      {rich ? (
        <Editor
          disabled={rest.disabled}
          ref={controller.field.ref}
          value={controller.field.value}
          onTextChange={(e) => controller.field.onChange(e.htmlValue || '')}
          style={{
            height: '320px',
          }}
        />
      ) : (
        <textarea
          className="textarea w-full"
          {...rest}
          {...controller.field}
        ></textarea>
      )}

      <div className="flex justify-between">
        {error ? (
          <p className="text-error">{error}</p>
        ) : (
          <p className="label">{props.description}</p>
        )}

        {props.maxLength && (
          <div className="label">
            {controller.field.value ? controller.field.value.length : 0} /{' '}
            {props.maxLength}
          </div>
        )}
      </div>
    </fieldset>
  );
}

export function ControlledCheckbox(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>
      <label className="label">
        <input
          type="checkbox"
          className="toggle"
          onChange={controller.field.onChange}
          checked={controller.field.value}
          onBlur={controller.field.onBlur}
          ref={controller.field.ref}
          {...rest}
        />
      </label>
    </fieldset>
  );
}

export function ControlledFileInput(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  const error = controller.fieldState.error?.message;

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Pick a file</legend>

      <input
        type="file"
        className="file-input"
        multiple={false}
        accept="pdf, doc, docx, png, jpg, jpeg, webp"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          controller.field.onChange(file);
        }}
        {...rest}
      />

      {error ? (
        <p className="text-error">{error}</p>
      ) : (
        <p className="label">{props.description}</p>
      )}
    </fieldset>
  );
}

export function ControlledRangeInput(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  const error = controller.fieldState.error?.message;

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{props.label}</legend>
      <input
        type="range"
        className="range w-full"
        {...rest}
        {...controller.field}
        onChange={(e) => {
          controller.field.onChange(e.target.valueAsNumber);
        }}
      />

      {error ? (
        <p className="text-error">{error}</p>
      ) : (
        <p className="label">{props.description}</p>
      )}
    </fieldset>
  );
}

export function ControlledBooleanInput(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  console.log(controller.field.value);

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>

      <div className="flex gap-2">
        <button
          type="button"
          className={[
            'btn',
            !controller.field.value ? 'btn-neutral' : 'btn-outline',
          ].join(' ')}
          onClick={() => controller.field.onChange(false)}
        >
          No
        </button>
        <button
          type="button"
          className={[
            'btn',
            controller.field.value ? 'btn-neutral' : 'btn-outline',
          ].join(' ')}
          onClick={() => controller.field.onChange(true)}
        >
          Yes
        </button>
      </div>
    </fieldset>
  );
}
