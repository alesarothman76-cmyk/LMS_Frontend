// src/features/media/hooks/useMediaFilter.ts
import { useState } from 'react';
import { mediaService } from '../services/mediaService';
import { MediaDto } from '../types';

export function useMediaFilter() {
    const [mediaList, setMediaList] = useState<MediaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filterByMimeType = async (mimeType: string) => {
        // Guard: do not send a request if the MIME type is empty or invalid
        if (!mimeType || mimeType.trim() === '') return;
        
        setLoading(true);
        setError(null);
        try {
            // Call the updated service that targets port 5005 directly
            const data = await mediaService.getByMimeType(mimeType);
            setMediaList(data);
        } catch (err: unknown) {
            console.error("Filter Error: ", err);
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch matching files from the server.');
            setMediaList([]);
        } finally {
            setLoading(false);
        }
    };

    return { mediaList, loading, error, filterByMimeType };
}