import { getDownloadUrl } from '@vercel/blob';
import React from 'react';
import { urlToFile } from 'utils';

export function useDownloadImage(
  url: string | undefined | null,
  onFile: (file: File) => void,
) {
  const [isLoading, setIsLoading] = React.useState(true);

  const injectFile = React.useCallback(async () => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    const downloadUrl = getDownloadUrl(url);
    const file = await urlToFile(downloadUrl, 'file');

    onFile(file);
    setIsLoading(false);
  }, [url, onFile]);

  React.useEffect(() => {
    injectFile();
  }, [injectFile]);

  return { isLoading };
}
