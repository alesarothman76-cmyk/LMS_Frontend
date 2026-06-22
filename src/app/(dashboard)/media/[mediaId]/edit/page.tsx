"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUpdateMedia } from '../../../../../features/media/hooks/useUpdateMedia';
import { UpdateMediaDto, ResourceValueDto } from '../../../../../features/media/types';
import { EditMediaFormView } from '../../../../../features/media/ui/EditMediaFormView';
import { mediaService } from '../../../../../features/media/services/mediaService';

interface EditMediaProps {
    onSuccess?: () => void;   
}

export default function EditMediaForm({ onSuccess }: EditMediaProps) {
    const params = useParams();
    
    // Read mediaId properly matching your route segment [mediaId]
    const mediaId = Number(params?.mediaId); 

    const { updateMedia, loading, successMessage, error } = useUpdateMedia();
    
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fileName, setFileName] = useState('');
    const [altText, setAltText] = useState('');
    const [eavValues, setEavValues] = useState<ResourceValueDto[]>([]);

    useEffect(() => {
        const fetchMediaDetails = async () => {
            if (!mediaId || isNaN(mediaId)) {
                console.log("Invalid mediaId:", mediaId);
                setIsLoadingData(false);
                return;
            }
            
            setIsLoadingData(true);
            console.log("Sending request to fetch data for mediaId:", mediaId);
            
            try {
                // Corrected endpoint path mapping to match your C# MediatR endpoint
                const data = await mediaService.getMediaForEdit(mediaId);
                console.log("Data retrieved from server:", data);
                
                if (data) {
                    setFileName(data.fileName || '');
                    setAltText(data.altText || '');
                    setEavValues(data.values || []); 
                }
            } catch (err) {
                console.error("Error occurred while fetching media details:", err);
            } finally {
                setIsLoadingData(false);
                console.log("Fetch operation completed.");
            }
        };

        void fetchMediaDetails();
    }, [mediaId]);

    // Combined/Simplified loading check to prevent premature renders
    if (!mediaId || isNaN(mediaId) || isLoadingData) {
        return <div className="text-center py-6 text-xs text-gray-400">Loading media data from server...</div>;
    }
    
    const handleEavTextChange = (index: number, newText: string) => {
        const updated = [...eavValues];
        if (updated[index]) {
            updated[index] = { ...updated[index], valueText: newText };
            setEavValues(updated);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatePayload: UpdateMediaDto = {
            id: mediaId,
            itemId: null, 
            fileName: fileName.trim(),
            altText: altText.trim() || null,
            values: eavValues,
            currentUserId: "" 
        };

        const isSuccess = await updateMedia(mediaId, updatePayload);
        if (isSuccess && onSuccess) {
            onSuccess();
        }
    };

    return (
        <EditMediaFormView 
            fileName={fileName}
            setFileName={setFileName}
            altText={altText}
            setAltText={setAltText}
            eavValues={eavValues}
            handleEavTextChange={handleEavTextChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            successMessage={successMessage}
            mediaId={mediaId}
        />
    );
}