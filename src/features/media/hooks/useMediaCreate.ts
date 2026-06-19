import { useState } from 'react';
import { mediaService } from '../services/mediaService';
import { CreateMediaRequest, MediaValueItem } from '../types';
import { AxiosError } from 'axios';

export function useMedia() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Base media form state
    const [mediaData, setMediaData] = useState({
        itemId: '',
        fileName: '',
        altText: '',
        ownerId: 'system-admin'
    });

    // Dynamic EAV field state
    const [valuesList, setValuesList] = useState<MediaValueItem[]>([
        { id: 0, propertyId: 0, valueText: '', valueUri: '', valueResourceId: 0, type: 'text', language: 'ar' }
    ]);

    // Update a specific dynamic EAV field entry
    const handleValueChange = (index: number, field: keyof MediaValueItem, value: unknown) => {
        setValuesList(prev => prev.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        ));
    };

    // Add a new dynamic EAV field row
    const addNewValueField = () => {
        setValuesList(prev => [
            ...prev, 
            { id: 0, propertyId: 0, valueText: '', valueUri: '', valueResourceId: 0, type: 'text', language: 'ar' }
        ]);
    };

    // Remove a dynamic EAV field row
    const removeValueField = (index: number) => {
        if (valuesList.length === 1) return; // Keep at least one row
        setValuesList(prev => prev.filter((_, i) => i !== index));
    };

    // This handler validates and submits the final data to the server
    const submitMedia = async () => {
        if (!mediaData.itemId || !mediaData.fileName) {
            setError("Please fill in the required fields (parent item ID and file name).");
            return false;
        }

        setIsLoading(true);
        setError(null);

        const requestBody: CreateMediaRequest = {
    itemId: Number(mediaData.itemId),
    fileName: mediaData.fileName,
    altText: mediaData.altText || '',
    ownerId: mediaData.ownerId || '',
    values: valuesList.map(v => ({
        ...v,
        propertyId: Number(v.propertyId),
        valueUri: v.valueUri ? v.valueUri : null, 
        valueResourceId: v.valueResourceId ? Number(v.valueResourceId) : null
    }))
};

        try {
            await mediaService.createMedia(requestBody);
            
            // Reset the form after success
            setMediaData({ itemId: '', fileName: '', altText: '', ownerId: '' });
            setValuesList([{ id: 0, propertyId: 0, valueText: '', valueUri: '', valueResourceId: 0, type: 'text', language: 'ar' }]);
            
            alert('Media record created and saved successfully! 🎉');
            return true;
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message || 'Failed to connect to the server and save media.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mediaData,
        setMediaData,
        valuesList,
        handleValueChange,
        addNewValueField,
        removeValueField,
        isLoading,
        error,
        submitMedia
    };
}