import React from 'react';
import { ControlledInput, ControlledTextarea } from './inputs';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Form } from 'models/form';
import { FormTheme } from './form-theme';

export function FormDetails() {
  const formState = useFormState();

  return (
    <React.Fragment>
      <ImagePreview />

      <ControlledInput
        name="title"
        label="Title"
        disabled={formState.isSubmitting}
        placeholder="Software Engineer"
      />

      <ControlledInput
        name="location"
        label="Location"
        disabled={formState.isSubmitting}
        placeholder="San Francisco, CA"
      />

      <ControlledTextarea
        name="description"
        label="Description"
        disabled={formState.isSubmitting}
        rich
      />

      <FormTheme />
    </React.Fragment>
  );
}

function ImagePreview() {
  const formContext = useFormContext<Form>();
  const coverImage = useWatch<Form, 'coverImage'>({
    name: 'coverImage',
  });
  const imgRef = React.useRef<HTMLImageElement>(null);
  const uploadRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!imgRef.current) return;

    imgRef.current.src = URL.createObjectURL(coverImage);
  }, [coverImage, imgRef]);

  const openFileInput = () => uploadRef.current?.click();

  return (
    <React.Fragment>
      {coverImage.size ? (
        <img
          className="h-72 w-full object-cover rounded"
          ref={imgRef}
          onClick={openFileInput}
          alt="Cover image"
        />
      ) : (
        <div
          className="h-72 w-full rounded bg-base-200 flex-col flex items-center justify-center hover:bg-base-300 cursor-pointer"
          onClick={openFileInput}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>

          <p className="grow-[unset]">Cover image</p>
        </div>
      )}

      <input
        hidden
        type="file"
        multiple={false}
        accept="image/png, image/jpg, image/jpeg, image/webp"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;

          if (file) {
            formContext.setValue('coverImage', file, {
              shouldValidate: formContext.formState.isSubmitted,
              shouldDirty: true,
            });
          }
        }}
        ref={uploadRef}
      />

      <div className="flex justify-between">
        {formContext.formState.errors.coverImage && (
          <p className="text-error">
            {formContext.formState.errors.coverImage.message}
          </p>
        )}

        {coverImage.size > 0 && (
          <button
            onClick={() => formContext.setValue('coverImage', new File([], ''))}
            className="link ml-auto"
          >
            Remove image
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
