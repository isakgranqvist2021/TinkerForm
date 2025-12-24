import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import { useDownloadImage } from './use-download-image';
import React from 'react';

function useUploadFile() {
  const mutation = useMutation(
    '/api/upload',
    async (url, { arg }: { arg: File }): Promise<string> => {
      const formData = new FormData();
      formData.set('file', arg);

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Could not upload file');
      }

      const data = await res.json();

      return data.url;
    },
    {
      onError: () => {
        toast.error('Error uploading file');
      },
    },
  );

  return {
    isLoading: mutation.isMutating,
    upload: mutation.trigger,
  };
}

export function useFileMutation(props: {
  getUrl: string | null | undefined;
  postUrl: string;
  onError?: () => void;
  onSuccess?: () => void;
}) {
  const uploadFile = useUploadFile();

  const [file, setFile] = React.useState<File | null>(null);

  const downloadImage = useDownloadImage(props.getUrl, setFile);

  const mutation = useMutation(
    props.postUrl,
    async (url, { arg }: { arg: File | null }) => {
      const fileUrl = arg ? await uploadFile.upload(arg) : null;

      const res = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({
          url: fileUrl,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Could update team');
      }

      return arg;
    },
    {
      onError: props.onError,
      onSuccess: (file) => {
        setFile(file);
        props.onSuccess?.();
      },
    },
  );

  const isLoading = mutation.isMutating || downloadImage.isLoading;

  console.log(downloadImage.isLoading, file);

  return {
    file,
    isLoading,
    trigger: mutation.trigger,
  };
}
