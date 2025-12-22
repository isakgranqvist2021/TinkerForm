'use client';

import {
  ArrowDownTrayIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useUpload } from 'hooks/use-dropzone';
import React from 'react';
import { cn } from 'utils';

interface UploadImageProps {
  onChange: (file: File | null) => void;
  file: File | null;

  label: string;

  className?: React.ComponentProps<'div'>['className'];
}

export function UploadImage(props: UploadImageProps) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const uploadRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!imgRef.current || !props.file?.size) return;

    const url = URL.createObjectURL(props.file);
    imgRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [props.file, imgRef.current]);

  const openFileInput = () => uploadRef.current?.click();
  const removeImage = () => props.onChange(null);

  const upload = useUpload(props.onChange);

  return (
    <React.Fragment>
      <div
        ref={upload.dropzoneRef}
        className={cn(
          'relative group overflow-hidden rounded h-72 w-full',
          props.className,
        )}
      >
        <div
          className={cn(
            'absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] transition-all ease-in duration-200',
            upload.isDraggingOver ? 'bg-black/75' : 'pointer-events-none',
          )}
        >
          {upload.isDraggingOver && (
            <ArrowDownTrayIcon className="size-12 text-white text-center animate-bounce" />
          )}
        </div>

        {props.file?.size ? (
          <div className="relative h-full w-full">
            <img
              className="h-full w-full object-cover rounded-[inherit]"
              ref={imgRef}
              alt={props.label}
            />

            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={removeImage}
                className="btn btn-error btn-outline btn-circle"
                title="Remove image"
              >
                <TrashIcon className="size-6" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="h-full w-full rounded-[inherit] bg-base-200 flex-col flex items-center justify-center hover:bg-base-300 cursor-pointer"
            onClick={openFileInput}
          >
            <PhotoIcon className="size-12" />
            <p className="grow-[unset]">{props.label}</p>
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
          if (file) upload.uploadFile(file);
        }}
        ref={uploadRef}
      />
    </React.Fragment>
  );
}
