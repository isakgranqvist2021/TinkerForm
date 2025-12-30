'use client';

import React from 'react';
import { UploadImage } from './upload-cover-image';
import { useUpdateTeamCoverImage, useUploadFile } from 'hooks/use-upload';
import { useRouter } from 'next/navigation';

interface EditTeamSettingsCoverImageProps {
  coverImage: string | null | undefined;
}

export function EditTeamSettingsCoverImage(
  props: EditTeamSettingsCoverImageProps,
) {
  const updateTeamCoverImage = useUpdateTeamCoverImage();
  const uploadFile = useUploadFile();

  const router = useRouter();

  const handleChange = async (file: File | null) => {
    const url = await uploadFile.upload({
      file,
      url: props.coverImage,
    });

    await updateTeamCoverImage.update(url);

    router.refresh();
  };

  const isLoading = updateTeamCoverImage.isLoading || uploadFile.isLoading;

  return (
    <UploadImage
      className="rounded-md mt-4"
      isLoading={isLoading}
      label="Cover Image"
      src={props.coverImage ?? null}
      onChange={handleChange}
    />
  );
}
