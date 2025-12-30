import { UploadParams } from 'models/file';
import useMutation from 'swr/mutation';

export function useUploadFile() {
  const mutation = useMutation(
    '/api/upload',
    async (url, { arg }: { arg: UploadParams }): Promise<string | null> => {
      const formData = new FormData();

      if (arg.file) {
        formData.set('file', arg.file);
      }

      if (arg.url) {
        formData.set('url', arg.url);
      }

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
  );

  return {
    isLoading: mutation.isMutating,
    upload: mutation.trigger,
  };
}

export function useUpdateTeamCoverImage() {
  const mutation = useMutation(
    '/api/proxy/team/cover-image',
    async (url, { arg }: { arg: string | null }): Promise<string> => {
      const res = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ url: arg }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Could not delete file');
      }

      const data = await res.json();

      return data.url;
    },
  );

  return {
    isLoading: mutation.isMutating,
    update: mutation.trigger,
  };
}
