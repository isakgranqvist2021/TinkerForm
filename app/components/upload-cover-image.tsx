'use client';

import { ArrowDownTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';
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
            <ArrowDownTrayIcon className="size-12 text-white text-center animate-bounce" />
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
            <PhotoIcon className="size-12" />

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
            onClick={() =>
              formContext.setValue('coverImage', new File([], ''), {
                shouldDirty: true,
                shouldValidate: formContext.formState.isSubmitted,
              })
            }
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
