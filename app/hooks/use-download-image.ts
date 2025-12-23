import { getDownloadUrl } from '@vercel/blob';
import React from 'react';
import { urlToFile } from 'utils';

export function useDownloadImage(
  url: string | undefined | null,
  onFile: (file: File) => void,
) {
  const injectFile = React.useCallback(async () => {
    if (!url) return;

    const downloadUrl = getDownloadUrl(url);
    const file = await urlToFile(downloadUrl, 'cover-image');

    onFile(file);
  }, [url, onFile]);

  React.useEffect(() => {
    injectFile();
  }, [injectFile]);
}
