import { useController } from 'react-hook-form';
import { toast } from 'sonner';

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
      />

      {error ? (
        <p className="text-error">{error}</p>
      ) : (
        <p className="label">{props.description}</p>
      )}
    </fieldset>
  );
}

export function ControlledTextarea(
  props: ControlledComponentProps & React.ComponentProps<'textarea'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  const error = controller.fieldState.error?.message;

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{props.label}</legend>
      <textarea
        className="textarea w-full"
        {...rest}
        {...controller.field}
      ></textarea>

      {error ? (
        <p className="text-error">{error}</p>
      ) : (
        <p className="label">{props.description}</p>
      )}
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

export function ControlledFileInput(
  props: ControlledComponentProps & React.ComponentProps<'input'>,
) {
  const { name, label, ...rest } = props;

  const controller = useController({ name });

  const error = controller.fieldState.error?.message;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      toast.error('File upload failed');
      return;
    }
    const data = await res.json();
    controller.field.onChange(data.url);
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Pick a file</legend>

      <input
        type="file"
        className="file-input"
        onChange={handleFileChange}
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
