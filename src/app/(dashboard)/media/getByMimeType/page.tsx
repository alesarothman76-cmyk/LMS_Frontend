"use client";

import React, { useState } from 'react';
import { useMediaFilter } from '../../../../features/media/hooks/useMediaByMimeType';
import { MediaFilterView } from '../../../../features/media/ui/MediaFilterView';

export default function MediaFilterPage() {
    const { mediaList, loading, error, filterByMimeType } = useMediaFilter();
    const [searchQuery, setSearchQuery] = useState('');

    const filterOptions = [
        { label: "PNG Images", value: "image/png" },
        { label: "PDF Files", value: "application/pdf" },
        { label: "JPEG Images", value: "image/jpeg" }
    ];

    // Search handler when the form is submitted
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            filterByMimeType(searchQuery.trim());
        }
    };

    // Helper for quick tag buttons
    const handleTagClick = (value: string) => {
        setSearchQuery(value);
        filterByMimeType(value);
    };

    return (
        <MediaFilterView 
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery} 
    filterOptions={filterOptions}
    handleSearch={handleSearch}     
    handleTagClick={handleTagClick}
    loading={loading}
    error={error}
    mediaList={mediaList.map(media => ({
        ...media,
        altText: media.altText ?? "",
        values: media.values.map(val => ({
            ...val,
            valueUri: val.valueUri ?? ""
        }))
    }))} 
/>
    );
}