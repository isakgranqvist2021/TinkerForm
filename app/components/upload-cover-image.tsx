'use client';

import {
  COVER_IMAGE_FILE_TYPES,
  COVER_IMAGE_MAX_SIZE,
  Form,
} from 'models/form';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from 'utils';

export function UploadCoverImage() {
  const formContext = useFormContext<Form>();
  const coverImage = useWatch<Form, 'coverImage'>({
    name: 'coverImage',
  });
  const imgRef = React.useRef<HTMLImageElement>(null);
  const uploadRef = React.useRef<HTMLInputElement>(null);

  const uploadFile = (file: File) => {
    formContext.setValue('coverImage', file, {
      shouldValidate: formContext.formState.isSubmitted,
      shouldDirty: true,
    });
  };

  const { dropzoneRef, isDraggingOver } = useDropzone((fileList) => {
    const file = fileList[0];

    if (!COVER_IMAGE_FILE_TYPES.includes(file.type)) {
      toast.error(
        `Invalid file type. Please upload a ${COVER_IMAGE_FILE_TYPES.map((fileType) => fileType.split('/')[1].toUpperCase()).join(', ')} file.`,
      );
      return;
    }

    if (file.size > COVER_IMAGE_MAX_SIZE) {
      toast.error('File size exceeds the maximum limit of 5MB.');
      return;
    }

    if (file) {
      uploadFile(file);
    }
  });

  React.useEffect(() => {
    if (!imgRef.current) return;

    imgRef.current.src = URL.createObjectURL(coverImage);
  }, [coverImage, imgRef]);

  const openFileInput = () => uploadRef.current?.click();

  return (
    <React.Fragment>
      <div ref={dropzoneRef} className="relative">
        <div
          className={cn(
            'absolute w-full h-full flex items-center justify-center rounded transition-all ease-in duration-200',
            isDraggingOver ? 'bg-black/75' : 'pointer-events-none',
          )}
        >
          {isDraggingOver && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12 text-white text-center animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          )}
        </div>

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
      </div>

      <input
        hidden
        type="file"
        multiple={false}
        accept="image/png, image/jpg, image/jpeg, image/webp"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;

          if (file) {
            uploadFile(file);
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

function useDropzone(onDrop: (files: FileList) => void) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const dropzoneRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (!dropzone) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();

      setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();

      setIsDraggingOver(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      const files = e.dataTransfer?.files;

      if (files && files.length > 0) {
        onDrop(files);
      }

      setIsDraggingOver(false);
    };

    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('dragleave', handleDragLeave);
    dropzone.addEventListener('drop', handleDrop);

    return () => {
      dropzone.removeEventListener('dragover', handleDragOver);
      dropzone.removeEventListener('dragleave', handleDragLeave);
      dropzone.removeEventListener('drop', handleDrop);
    };
  }, [dropzoneRef, onDrop]);

  return { dropzoneRef, isDraggingOver };
}
