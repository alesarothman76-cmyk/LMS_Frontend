import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { mediaService } from '../services/mediaService';
import { MediaDto } from '../types';
import { mockMedia } from '../mock/media';
//import { mockMedia } from '../../resourceTemplate/mock/templates';

export const useAllMedia = () => {
  const [mediaList, setMediaList] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mediaService.getAllMedia();
      setMediaList(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.Message || 'Unable to load media from API. Showing offline data.');
      } else {
        setError('Unable to load media from API. Showing offline data.');
      }
      setMediaList(mockMedia);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMedia();
  }, [fetchMedia]);

  return { mediaList, loading, error, refreshMedia: fetchMedia };
};
