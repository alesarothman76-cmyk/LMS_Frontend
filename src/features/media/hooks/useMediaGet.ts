import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../services/mediaService';
import { GetMediaResponse } from '../types/index';
import axios from 'axios';

export const useMediaGet = (mediaId: number) => {
    const [media, setMedia] = useState<GetMediaResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null);

    const fetchValues = useCallback(async () => {
        if (!mediaId || isNaN(mediaId)) return;
        
        try {
            setLoading(true); 
            setError(null);
            const data = await mediaService.getMedia(mediaId);
            setMedia(data); 
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.Message || "Failed to load media data");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [mediaId]);

    useEffect(() => {
        if (mediaId && !isNaN(mediaId)) {
void Promise.resolve().then(fetchValues);        }
    }, [fetchValues, mediaId]);

    return { media, loading, error, refreshValues: fetchValues };
};