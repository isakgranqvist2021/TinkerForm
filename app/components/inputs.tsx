import { useController } from 'react-hook-form';

interface ControlledComponentProps {
  label: string;
  placeholder?: string;
  name: string;
}

export function ControlledInput(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{props.label}</legend>

      <input
        type="text"
        className="input w-full"
        {...rest}
        {...controller.field}
      />

      <p className="error">{controller.fieldState.error?.message}</p>
    </fieldset>
  );
}

export function ControlledTextarea(
  props: ControlledComponentProps & React.ComponentProps<'textarea'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{props.label}</legend>
      <textarea
        className="textarea w-full"
        {...rest}
        {...controller.field}
      ></textarea>
      <p className="error">{controller.fieldState.error?.message}</p>
    </fieldset>
  );
}

export function ControlledCheckbox(props: ControlledComponentProps) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>
      <label className="label">
        <input
          type="checkbox"
          defaultChecked
          className="toggle"
          {...rest}
          {...controller.field}
        />
      </label>
    </fieldset>
  );
}
