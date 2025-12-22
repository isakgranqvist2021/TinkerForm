import { IMAGE_FILE_TYPES, IMAGE_MAX_SIZE } from 'models/form';
import React from 'react';
import { toast } from 'sonner';

export function useDropzone(onDrop: (files: FileList) => void) {
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

export function useUpload(onUpload: (file: File) => void) {
  const uploadFile = (file: File) => {
    if (!IMAGE_FILE_TYPES.includes(file.type)) {
      toast.error(
        `Invalid file type. Please upload a ${IMAGE_FILE_TYPES.map((fileType) => fileType.split('/')[1].toUpperCase()).join(', ')} file.`,
      );
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      toast.error('File size exceeds the maximum limit of 5MB.');
      return;
    }

    onUpload(file);
  };

  const dropzone = useDropzone((fileList) => {
    const file = fileList[0];

    if (file) {
      uploadFile(file);
    }
  });

  return {
    ...dropzone,
    uploadFile,
  };
}
