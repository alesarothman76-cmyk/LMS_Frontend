import { useState } from 'react';
import { mediaService } from '../services/mediaService';

export function useUploadMedia() {
    const [uploading, setUploading] = useState(false);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (mediaId: number, file: File) => {
        setUploading(true);
        setError(null);
        setUploadedPath(null);
        try {
            const result = await mediaService.uploadMediaFile(mediaId, file);
            setUploadedPath(result.path);
            return true;
        } catch (err: unknown) {
            console.error("Upload Error:", err);
            setError((err as { response?: { data: string } }).response?.data || "An error occurred during upload. Make sure the file size does not exceed 50MB.");
            return false;
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading, uploadedPath, error };
}