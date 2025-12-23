'use client';

import React from 'react';
import { UploadImage } from './upload-cover-image';
import { useTeam, useUpdateTeam } from 'hooks/use-team';
import { useDownloadImage } from 'hooks/use-download-image';
import { toast } from 'sonner';

export function EditTeamSettingsCoverImage() {
  const teamSettings = useTeam();

  const [file, setFile] = React.useState<File | null>(null);

  const { updateTeam, isLoading } = useUpdateTeam();

  useDownloadImage(teamSettings.data?.coverImage, setFile);

  return (
    <UploadImage
      isLoading={teamSettings.isLoading || isLoading}
      label="Cover Image"
      file={file}
      onChange={async (file) => {
        const ok = await updateTeam({ coverImage: file });

        if (ok) {
          setFile(file);
          toast.success('Cover image updated');
        } else {
          toast.error('Cover image not saved');
        }
      }}
    />
  );
}
