import { useState } from 'react';
import { mediaService } from '../services/mediaService';

export function useDeleteMedia() {
    const [deletingId, setDeletingId] = useState<number | null>(null); // Track which item is currently being deleted in the UI
    const [error, setError] = useState<string | null>(null);

    const deleteMedia = async (mediaId: number): Promise<boolean> => {
        // Confirm with the user before performing the deletion
        const confirmed = window.confirm(`Are you sure you want to permanently delete media file #${mediaId}?`);
        if (!confirmed) return false;

        setDeletingId(mediaId);
        setError(null);

        try {
            await mediaService.deleteMedia(mediaId);
            return true;
        } catch (err: unknown) {
            console.error("Delete Error:", err);
            // Capture custom server error messages (Unauthorized, BadRequest, etc.)
            const serverMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as { response?: { data?: string } }).response?.data || "An error occurred while attempting to delete the file.";
            setError(typeof serverMessage === 'string' ? serverMessage : "File deletion failed.");
            return false;
        } finally {
            setDeletingId(null);
        }
    };

    return { deleteMedia, deletingId, error };
}