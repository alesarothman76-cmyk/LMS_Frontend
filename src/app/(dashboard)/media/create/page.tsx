"use client";

import React, { useState } from 'react';
import { useMedia } from '../../../../features/media/hooks/useMediaCreate';
import { useUploadMedia } from '../../../../features/media/hooks/useUploadMedia';
import { MediaCreateView } from '../../../../features/media/ui/MediaCreateView';

export default function CreateMediaPage() {
    // Local state to store the selected file
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    // Extracting logic and states from custom hooks
    const { 
        mediaData, setMediaData, 
        valuesList, handleValueChange, addNewValueField, removeValueField,
        isLoading: isCreatingMedia, error: createError, submitMedia 
    } = useMedia();

    const { uploadFile, uploading: isUploading, error: uploadError } = useUploadMedia();

    // Capture the file when selected from the UI
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            console.log("Saving core metadata...");
            const result = await submitMedia(); 
            console.log("Data save result:", result);
            
            if (!result) {
                alert("Failed to save media core metadata.");
                return;
            }

            let mediaId: number | string | null = null;

            if (typeof result === 'number' || typeof result === 'string') {
                mediaId = result;
            } else if (typeof result === 'object') {
                mediaId = ('id' in result ? (result as { id: number | string }).id : null) || 
                          ('mediaId' in result ? (result as { mediaId: number | string }).mediaId : null);
            }

            console.log("Extracted Media ID:", mediaId);

            if (mediaId) {
                if (selectedFile) {
                    console.log("Uploading associated file...");
                    const success = await uploadFile(Number(mediaId), selectedFile);
                    if (success) {
                        alert("Media and file uploaded successfully!");
                    } else {
                        alert("Metadata was saved but an error occurred while uploading the file.");
                    }
                } else {
                    alert("Data saved successfully, but no file was selected for upload.");
                }
            } else {
                alert("Media ID reference not found.");
            }

        } catch (err) {
            console.error("An unexpected error occurred during the process:", err);
        }
    };

    return (
        <MediaCreateView 
            mediaData={mediaData}
            setMediaData={setMediaData}
            valuesList={valuesList}
            handleValueChange={handleValueChange}
            addNewValueField={addNewValueField}
            removeValueField={removeValueField}
            isLoading={isCreatingMedia || isUploading}
            error={createError || uploadError} 
            onSubmit={handleSubmit}
            onFileChange={handleFileChange} 
        />
    );
}