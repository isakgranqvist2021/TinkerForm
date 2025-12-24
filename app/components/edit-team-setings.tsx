'use client';

import React from 'react';
import { UploadImage } from './upload-cover-image';
import { toast } from 'sonner';
import { useFileMutation } from 'hooks/use-upload';

interface EditTeamSettingsCoverImageProps {
  coverImage: string | null | undefined;
}

export function EditTeamSettingsCoverImage(
  props: EditTeamSettingsCoverImageProps,
) {
  const teamCoverImage = useFileMutation({
    getUrl: props.coverImage,
    postUrl: '/api/proxy/team/cover-image',
    onError: () => toast.error('Cover image not saved.'),
    onSuccess: () => toast.success('Cover image updated'),
  });

  return (
    <UploadImage
      className="rounded-none"
      isLoading={teamCoverImage.isLoading}
      label="Cover Image"
      file={teamCoverImage.file}
      onChange={teamCoverImage.trigger}
    />
  );
}
