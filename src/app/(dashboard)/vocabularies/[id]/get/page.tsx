'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useVocabularyDetails } from '../../../../../features/vocabulary/hooks/useVocabularyDetails';

import { VocabularyDetails } from '../../../../../features/vocabulary/ui/VocabularyDetails';

export default function VocabularyDetailsPage() {
    const params = useParams();
    const id = params?.id as string;

    const { vocabulary, loading, error, refetch } = useVocabularyDetails(id);

    return (
        <VocabularyDetails 
            vocabulary={vocabulary}
            loading={loading}
            error={error}
            onRetry={refetch}
        />
    );
}