import { useState } from 'react';
import { mediaService } from '../services/mediaService';
import { UpdateMediaDto } from '../types';

export function useUpdateMedia() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateMedia = async (id: number, dto: UpdateMediaDto) => {
        if (id !== dto.id) {
            setError("Validation error: the route id must match the payload id.");
            return false;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const result = await mediaService.updateMedia(id, dto);
            setSuccessMessage(result.message || "Data updated successfully.");
            return true;
        } catch (err: unknown) {
            console.error("PUT Error: ", err);
            setError((err as { response?: { data: string } }).response?.data || "An error occurred while attempting to update the data.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateMedia, loading, successMessage, error };
}