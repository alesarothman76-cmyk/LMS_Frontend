'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVocabularyDetails } from '../../../../../features/vocabulary/hooks/useVocabularyDetails';
import { useMutateVocabulary } from '../../../../../features/vocabulary/hooks/useMutateVocabulary';
import { useFetchVocabularies } from '../../../../../features/vocabulary/hooks/useFetchVocabularies';
import { EditVocabularyForm } from '../../../../../features/vocabulary/ui/EditVocabularyForm';
import { PropertiesSection, PropertyItem } from '../../../../../features/vocabulary/ui/PropertiesSection';
import { VocabularyService } from '../../../../../features/vocabulary/services/vocabularyServices';

interface PropertyDto {
    id: number | string;
    label: string;
    uri?: string;
    localName?: string;
    namespaceUri?: string;
    termUri?: string;
}

function EditVocabularyContent({ 
    vocabularyId, 
    initialPrefix, 
    initialNamespaceUri, 
    initialLabel,
    properties,  
    fetchError,
    refetch,
}: { 
    vocabularyId: string;
    initialPrefix: string;
    initialNamespaceUri: string;
    initialLabel: string;
    properties: PropertyItem[];
    fetchError: string | null;
    refetch: () => Promise<void>;
}) {
    const router = useRouter();
    const { setVocabularies } = useFetchVocabularies();
    const { editVocabulary, mutationLoading, mutationError } = useMutateVocabulary(setVocabularies);

    const [formState, setFormState] = useState({
        prefix: initialPrefix,
        namespaceUri: initialNamespaceUri,
        label: initialLabel,
    });

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [propForm, setPropForm] = useState({ label: '', uri: '', localName: '' });
    const [editingPropId, setEditingPropId] = useState<number | null>(null);

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

    const handlePropInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setPropForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenCreateDialog = (): void => {
        setEditingPropId(null);
        setPropForm({ label: '', uri: '', localName: '' });
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (prop: PropertyItem): void => {
        setEditingPropId(prop.id ?? null);
        setPropForm({ 
            label: prop.label, 
            uri: prop.uri, 
            localName: prop.localName || '' 
        });
        setIsDialogOpen(true);
    };

    const handlePropSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            if (editingPropId !== null) {
                await VocabularyService.updateProperty(editingPropId, {
                    id: editingPropId,
                    label: propForm.label,
                    uri: propForm.uri,
                });
            } else {
                await VocabularyService.createProperty(Number(vocabularyId), {
                    label: propForm.label,
                    termUri: propForm.uri,
                    localName: propForm.localName || propForm.label,
                });
            }
            setIsDialogOpen(false);
            await refetch(); 
        } catch (err) {
            console.error('Failed to save property:', err);
        }
    };

    const handleDeleteProperty = async (propertyId: number): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await VocabularyService.deleteProperty(propertyId);
                await refetch(); 
            } catch (err) {
                console.error('Failed to delete property:', err);
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <EditVocabularyForm
                formState={formState}
                loading={false}
                mutationLoading={mutationLoading}
                error={mutationError || fetchError}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
            <PropertiesSection
                properties={properties} 
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                propForm={propForm}
                setPropForm={setPropForm}
                editingPropId={editingPropId}
                handleOpenCreateDialog={handleOpenCreateDialog}
                handleOpenEditDialog={handleOpenEditDialog}
                handlePropSubmit={handlePropSubmit}
                handleDeleteProperty={handleDeleteProperty}
                handleInputChange={handlePropInputChange}
            />
        </div>
    );
}

export default function EditVocabularyPage() {
    const params = useParams();
    const vocabularyId = params?.id as string;

    const { vocabulary, loading, error: fetchError, refetch } = useVocabularyDetails(vocabularyId);

    if (loading) {
        return <div className="p-8 text-center">Loading vocabulary data...</div>;
    }

    if (fetchError || !vocabulary) {
        return <div className="p-8 text-center text-red-500">{fetchError || 'Vocabulary not found'}</div>;
    }

    const properties: PropertyItem[] = (vocabulary.properties as PropertyDto[] || []).map((prop) => ({
        id: Number(prop.id),
        label: prop.label,
        localName: prop.localName || '', 
        uri: prop.termUri || prop.uri || prop.namespaceUri || '',
    }));
    
    console.log('properties:', JSON.stringify(properties, null, 2));
    console.log('raw vocabulary.properties:', JSON.stringify(vocabulary.properties, null, 2));

    return (
        <EditVocabularyContent
            key={vocabulary.id}
            vocabularyId={vocabularyId}
            initialPrefix={vocabulary.prefix}
            initialNamespaceUri={vocabulary.namespaceUri}
            initialLabel={vocabulary.label}
            properties={properties} 
            fetchError={fetchError}
            refetch={refetch}
        />
    );
}