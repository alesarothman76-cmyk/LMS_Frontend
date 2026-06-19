"use client";

import React from 'react';
import { useMedia } from '../../../../features/media/hooks/useMediaCreate';
import { MediaCreateView } from '../../../../features/media/ui/MediaCreateView';

export default function CreateMediaPage() {
    
    // Call all prepared logic with one custom hook
    const { 
        mediaData, setMediaData, 
        valuesList, handleValueChange, addNewValueField, removeValueField,
        isLoading, error, submitMedia 
    } = useMedia();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitMedia();
    };

    return (
        <MediaCreateView 
            mediaData={mediaData}
            setMediaData={setMediaData}
            valuesList={valuesList}
            handleValueChange={handleValueChange}
            addNewValueField={addNewValueField}
            removeValueField={removeValueField}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
        />
    );
}