"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTemplate } from '../../../../features/resourceTemplate/hooks/useCreateTemplate';
import { PropertyToTemplateInput } from '../../../../features/resourceTemplate/types';
import { CreateTemplateView } from '../../../../features/resourceTemplate/ui/CreateTemplateView';

export default function CreateTemplatePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ label: '', description: '' });
    const [selectedProperties, setSelectedProperties] = useState<PropertyToTemplateInput[]>([]);
    const { create, isSubmitting, error } = useCreateTemplate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label) return;
        await create({
            label: formData.label,
            description: formData.description,
            propertyIds: selectedProperties.map((prop) => prop.propertyId),
            propertyLinks: selectedProperties,
        });
    };

    return (
        <CreateTemplateView 
            formData={formData}
            setFormData={setFormData}
            onSelectedPropertiesChange={setSelectedProperties}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
            onCancel={() => router.push('/resourceTemplate')}
        />
    );
}