'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVocabularyDetails } from '../../../../../features/vocabulary/hooks/useVocabularyDetails';
import { useMutateVocabulary } from '../../../../../features/vocabulary/hooks/useMutateVocabulary';
import { useFetchVocabularies } from '../../../../../features/vocabulary/hooks/useFetchVocabularies';
import { EditVocabularyForm } from '../../../../../features/vocabulary/ui/EditVocabularyForm';

function EditVocabularyContent({ 
    vocabularyId, 
    initialPrefix, 
    initialNamespaceUri, 
    initialLabel,
    fetchError,
}: { 
    vocabularyId: string;
    initialPrefix: string;
    initialNamespaceUri: string;
    initialLabel: string;
    fetchError: string | null;
}) {
    const router = useRouter();
    const { setVocabularies } = useFetchVocabularies();
    const { editVocabulary, mutationLoading, mutationError } = useMutateVocabulary(setVocabularies);

    const [formState, setFormState] = useState({
        prefix: initialPrefix,
        namespaceUri: initialNamespaceUri,
        label: initialLabel,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            await editVocabulary(vocabularyId, {
                id: Number(vocabularyId),
                ...formState
            });
            router.push('/vocabularies');
        } catch (err) {
            console.error('Failed to update vocabulary:', err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit Vocabulary</h1>
        
            </div>
            
            <EditVocabularyForm
                formState={formState}
                loading={false}
                mutationLoading={mutationLoading}
                error={mutationError || fetchError}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </div>
    );
}

export default function EditVocabularyPage() {
    const params = useParams();
    const vocabularyId = params?.id as string;

    const { vocabulary, loading, error: fetchError } = useVocabularyDetails(vocabularyId);

    if (loading) {
        return <div className="p-8 text-center">Loading vocabulary data...</div>;
    }

    if (fetchError || !vocabulary) {
        return <div className="p-8 text-center text-red-500">{fetchError || 'Vocabulary not found'}</div>;
    }

    return (
        <EditVocabularyContent
            key={vocabulary.id}
            vocabularyId={vocabularyId}
            initialPrefix={vocabulary.prefix}
            initialNamespaceUri={vocabulary.namespaceUri}
            initialLabel={vocabulary.label}
            fetchError={fetchError}
        />
    );
}