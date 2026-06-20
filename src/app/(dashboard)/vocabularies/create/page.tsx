'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Import the combined hook containing addVocabulary and createProperty
import { useVocabulary } from '../../../../features/vocabulary/hooks/useVocabulary';

// Import the separated UI component
import { VocabularyForm } from '../../../../features/vocabulary/ui/VocabularyForm';

export default function CreateVocabularyPage() {
    const router = useRouter();
    
    // Use the comprehensive hook to manage vocabulary and properties together
    const { addVocabulary, createProperty, loading, error } = useVocabulary();

    // Extend the initial state to include the new property fields
    const [formState, setFormState] = useState({
        prefix: '',
        namespaceUri: '',
        label: '',
        propertyLabel: '',  
        propertyUri: '',
        localName: '', 
    });

    // 💡 New state to prevent submitting the form more than once on rapid clicking
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Create the vocabulary first
            const newVocabulary = await addVocabulary({
                prefix: formState.prefix,
                namespaceUri: formState.namespaceUri,
                label: formState.label,
            });

            console.log('Vocabulary created:', newVocabulary);

            // 2. Add the property if the data exists
            if (newVocabulary?.id && formState.propertyLabel && formState.propertyUri) {
                await createProperty(Number(newVocabulary.id), {
                    label: formState.propertyLabel,
                    localName: formState.localName || formState.propertyLabel,
                    termUri: formState.propertyUri,
                });
            }

            router.push('/vocabularies');

        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response: { data: { message?: string } } };
                console.log('Error:', JSON.stringify(axiosError.response.data, null, 2));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <VocabularyForm 
            formState={formState}
            mutationError={error}
            // 💡 Bind the disabled state to the save button to ensure no duplication
            mutationLoading={loading || isSubmitting}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
        />
    );
}