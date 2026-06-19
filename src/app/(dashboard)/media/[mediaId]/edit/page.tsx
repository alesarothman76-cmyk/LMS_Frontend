"use client";

import { useState } from 'react';
import { useUpdateMedia } from '../../../../../features/media/hooks/useUpdateMedia';
import { UpdateMediaDto, ResourceValueDto } from '../../../../../features/media/types';
import { EditMediaFormView } from '../../../../../features/media/ui/EditMediaFormView';

interface EditMediaProps {
    initialMedia?: { 
        id: number; 
        fileName: string; 
        altText: string | null; 
        itemId: number | null;
        values?: ResourceValueDto[]; 
    };
    onSuccess?: () => void;
}   

export default function EditMediaForm({ initialMedia, onSuccess }: EditMediaProps) {
    const { updateMedia, loading, successMessage, error } = useUpdateMedia();
    
    // ✅ Initialize state directly from props safely
    const [fileName, setFileName] = useState(initialMedia?.fileName || '');
    const [altText, setAltText] = useState(initialMedia?.altText || '');
    const [eavValues, setEavValues] = useState<ResourceValueDto[]>(initialMedia?.values || []);

    // If the initial data is not yet available, show a light loading indicator instead of breaking
    if (!initialMedia) {
        return <div className="text-center py-6 text-xs text-gray-400">Initializing file data...</div>;
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
            id: initialMedia.id,
            itemId: initialMedia.itemId,
            fileName: fileName.trim(),
            altText: altText.trim() || null,
            values: eavValues,
            currentUserId: "" 
        };

        const isSuccess = await updateMedia(initialMedia.id, updatePayload);
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
            mediaId={initialMedia.id}
        />
    );
}