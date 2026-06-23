'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useVocabularyDetails } from '../../../../../features/vocabulary/hooks/useVocabularyDetails';
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

function ManagePropertiesContent({
    vocabularyId,
    properties,
    refetch,
}: {
    vocabularyId: string;
    properties: PropertyItem[];
    refetch: () => Promise<void>;
}) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [propForm, setPropForm] = useState({ label: '', uri: '', localName: '' });
    const [editingPropId, setEditingPropId] = useState<number | null>(null);

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
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center space-x-4">
                <Link href={`/vocabularies/${vocabularyId}/edit`} className="text-[#a1887f] hover:underline">
                    ← Back to Details
                </Link>
                <h1 className="text-2xl font-bold">Manage Vocabulary Properties</h1>
            </div>

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

export default function ManagePropertiesPage() {
    const params = useParams();
    const vocabularyId = params?.id as string;

    const { vocabulary, loading, error: fetchError, refetch } = useVocabularyDetails(vocabularyId);

    if (loading) {
        return <div className="p-8 text-center">Loading properties...</div>;
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

    return (
        <ManagePropertiesContent 
            vocabularyId={vocabularyId}
            properties={properties}
            refetch={refetch}
        />
    );
}