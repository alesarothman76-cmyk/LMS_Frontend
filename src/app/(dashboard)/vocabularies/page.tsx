'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchVocabularies } from '../../../features/vocabulary/hooks/useFetchVocabularies';
import { useMutateVocabulary } from '../../../features/vocabulary/hooks/useMutateVocabulary';

// Import the separated UI component
import { VocabularyList } from '../../../features/vocabulary/ui/VocabularyList';

export default function VocabulariesPage() {
    const router = useRouter();
    
    // Fetch data and states from hooks
    const { vocabularies, setVocabularies, loading, error, refresh } = useFetchVocabularies();
    const { removeVocabulary } = useMutateVocabulary(setVocabularies);

    // Redirect to the create page
    const handleCreateRedirect = () => {
        router.push('/vocabularies/create');
    };

    // Redirect to the edit page (or you can link it to a Modal)
    const handleEditRedirect = (id: string | number) => {
        router.push(`/vocabularies/${id}/edit`);
    };

    // Redirect to the properties management page
    const handleManagePropertiesRedirect = (id: string | number) => {
        router.push(`/vocabularies/${id}/properties`);
    };

    // Delete with automatic refresh
    const handleDelete = async (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this vocabulary?')) {
            await removeVocabulary(Number(id));
            await refresh();
        }
    };

    return (
        <VocabularyList 
            vocabularies={vocabularies}
            loading={loading}
            error={error}
            onCreate={handleCreateRedirect}
            onEdit={handleEditRedirect}
            onDelete={handleDelete}
            onRefresh={refresh}
            onManageProperties={handleManagePropertiesRedirect}
        />
    );
}
