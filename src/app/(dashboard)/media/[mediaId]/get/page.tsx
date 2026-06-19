"use client";

import { useParams, useRouter } from 'next/navigation';
import { useMediaGet } from '../../../../../features/media/hooks/useMediaGet';
import { useDeleteMedia } from '../../../../../features/media/hooks/useDeleteMedia';
import { useDownloadMedia } from '../../../../../features/media/hooks/useDownloadMedia'; 
import { useUploadMedia } from '../../../../../features/media/hooks/useUploadMedia';    
import { useRef, useState, useEffect } from 'react';
import { ResourceValuesView } from '../../../../../features/media/ui/ResourceValuesView';

export default function ResourceValuesPage() {
    const params = useParams();
    const router = useRouter();
    const mediaId = params?.mediaId ? Number(params.mediaId) : 0;

    const { media, loading, error, refreshValues } = useMediaGet(mediaId);
    const { deleteMedia, deletingId, error: deleteError } = useDeleteMedia();
    const { downloadFile, downloading } = useDownloadMedia(); 
    const { uploadFile, uploading, error: uploadError, uploadedPath } = useUploadMedia(); 

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local state for secure image URL and fetch status
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [imageFetchError, setImageFetchError] = useState<boolean>(false);

    // Load the protected image with authorization header injection
    useEffect(() => {
        const fetchProtectedImage = async () => {
            if (!mediaId || !media?.mimeType?.startsWith('image/')) return;

            try {
                setImageLoading(true);
                setImageFetchError(false);
                
                const response = await fetch(`http://localhost:5000/api/media/${mediaId}/download`, {
                    method: 'GET',
                    headers: {
                        // Inject stored token so the server authenticates the request
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                });

                if (!response.ok) throw new Error("Unauthorized or Not Found");

                const blob = await response.blob();
                const localUrl = window.URL.createObjectURL(blob);
                setImageSrc(localUrl);
            } catch (err) {
                console.error("Failed to load secure image:", err);
                setImageFetchError(true);
            } finally {
                setImageLoading(false);
            }
        };

        fetchProtectedImage();

        // Clean up memory and revoke the object URL when leaving the page or changing the id
        return () => {
            if (imageSrc) {
                window.URL.revokeObjectURL(imageSrc);
            }
        };
    }, [mediaId, media?.mimeType, uploadedPath, imageSrc]); // Re-fetch when a new file has been uploaded

    // Delete handler
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to permanently delete this file along with all linked EAV values?")) {
            const isDeleted = await deleteMedia(mediaId);
            if (isDeleted) {
                const parentId = (media as { itemId?: number })?.itemId || (media as { entityId?: number })?.entityId;
                router.push(parentId ? `/items/${parentId}` : '/media');
            }
        }
    };

    // Download handler
    const handleDownload = async () => {
        await downloadFile(mediaId); 
    };

    // Upload and replace handler
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isUploaded = await uploadFile(mediaId, file);
        
        if (isUploaded && typeof refreshValues === 'function') {
            await refreshValues(); 
        }

        if (fileInputRef.current) fileInputRef.current.value = ''; 
    };

    const isFileDownloading = downloading === mediaId || !!downloading;
    const isImage = media?.mimeType?.startsWith('image/');

    return (
        <ResourceValuesView 
            media={media}
            mediaId={mediaId}
            loading={loading}
            error={error}
            imageSrc={imageSrc}
            imageLoading={imageLoading}
            imageFetchError={imageFetchError}
            isImage={!!isImage}
            isFileDownloading={isFileDownloading}
            deletingId={deletingId}
            uploading={uploading}
            deleteError={deleteError}
            uploadError={uploadError}
            uploadedPath={uploadedPath}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
        />
    );
}