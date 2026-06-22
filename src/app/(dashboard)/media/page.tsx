"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAllMedia } from '../../../features/media/hooks/useAllMedia';
import { MediaListView } from '../../../features/media/ui/MediaListView';

export default function MediaListPage() {
  const router = useRouter();
  const { mediaList, loading, error, refreshMedia } = useAllMedia();

  return (
    <MediaListView
      mediaList={mediaList}
      loading={loading}
      error={error}
      onRefresh={() => void refreshMedia()}
      onCreateRedirect={() => router.push('/media/create')}
    />
  );
}