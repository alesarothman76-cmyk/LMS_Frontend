// src/features/media/hooks/useMediaByItemId.ts
import { useState } from 'react';
import { mediaService } from '../services/mediaService';
import { MediaDto } from '../types';

export function useMediaByItemId() {
    const [mediaList, setMediaList] = useState<MediaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMediaByItem = async (itemId: number) => {
        if (!itemId || itemId.toString().trim() === '') return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await mediaService.getByItemId(itemId);
            setMediaList(data);
        } catch (err: unknown) {
            console.error("Fetch Error: ", err);
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch matching files from the server.');
            setMediaList([]);
        } finally {
            setLoading(false);
        }
    };

    return { mediaList, loading, error, fetchMediaByItem };
}